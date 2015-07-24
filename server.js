var _             = require('lodash')
var usernamePool  = require('./username-pool')

var users = []

module.exports = function(io) {
  io.on('connection', function(socket) {
    handleConnection(socket)
    handleDisconnect(socket)
    handleSetUsername(socket)
    handleMessages(socket)
    handleIsTyping(socket)
  })

  var handleConnection = function(socket) {
    users.push(socket)

    // assign a username for now
    socket.username = usernamePool.allocate()

    broadcastConnection(socket)

    console.log(socket.username + ' connected')
  }

  var handleDisconnect = function(socket) {
    socket.on('disconnect', function() {
      console.log(socket.username + ' has disconnected')
      _.remove(users, function(u) {return u==socket})
      usernamePool.deallocate(socket.username)

      broadcastDisconnection(socket)
    })
  }

  var handleSetUsername = function(socket) {
    socket.on('username', function(username, done) {
      if (!_.find(users, {username: username})) {
        broadcastChangedUsername(socket, socket.username, username)
        socket.username = username
        done()
      } else {
        done(null, {error: username + ' is taken'})
      }
    })
  }

  var handleMessages = function(socket) {
    socket.on('message', function(detail, done) {
      var recipient = _.find(users, {username: detail.to})

      if (recipient) {
        recipient.emit('message', 
          {from: socket.username, message: detail.message})
      }

      done()
    })
  }

  var handleIsTyping = function(socket) {
    socket.on('is typing', function(user) {
      var recipient = _.find(users, {username: user})

      recipient.emit('typing', socket.username)
    })
  }

  var broadcastConnection = function(socket) {
    io.emit('user connected', {
      username: socket.username,
      total_users: users.length
    })

    socket.emit('chat details', {
      username: socket.username,
      users: users
        .filter(function(s) {return s != socket})
        .map(function(s) {return s.username}),
      total_users: users.length
    })
  }

  var broadcastDisconnection = function(socket) {
    io.emit('user disconnected', socket.username)
  }

  var broadcastChangedUsername = function(socket, oldUsername, newUsername) {
    io.emit('username changed', {
      old_username: oldUsername,
      new_username: newUsername
    })
  }
}