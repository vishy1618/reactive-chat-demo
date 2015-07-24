var socketio  = require('socket.io-client')
var Rx        = require('rx')
var fromEvent = Rx.Observable.fromEvent

var lib = {
  init: function() {
    var client = this.client = socketio("http://localhost:3000")

    return new Promise(function(resolve, reject) {
      client.on('error', reject)

      client.on('chat details', resolve)
    })
  },
  connections: function() {
    return fromEvent(this.client, 'user connected')
  },
  disconnections: function() {
    return fromEvent(this.client, 'user disconnected')
  },
  usernameChanges: function() {
    return fromEvent(this.client, 'username changed')
  },
  messages: function() {
    return fromEvent(this.client, 'message')
  },
  typing: function() {
    return fromEvent(this.client, 'typing')
  },
  setUsername: function(username) {
    var that = this

    return new Promise(function(resolve, reject) {
      that.client.emit('username', username, function(response, error) {
        if (error)
          reject(error)
        else
          resolve(response)
      })
    })
  },
  sendMessage: function(to, message) {
    var that = this

    return new Promise(function(resolve, reject) {
      that.client.emit('message', {to: to, message: message}, function() {
        resolve()
      })
    })
  },
  isTyping: function() {
    var that = this

    return new Promise(function(resolve, reject) {
      that.client.emit('is typing', function() {
        resolve()
      })
    })
  }
}

lib.init()
.then(function(info) {
  console.log('info', info)

  lib.connections().forEach(function(data) {
    console.log('connected', data)
  })
  lib.disconnections().forEach(function(data) {
    console.log('disconnected', data)
  })
  lib.usernameChanges().forEach(function(data) {
    console.log('username changed', data)
  })
  lib.messages().forEach(function(data) {
    console.log('message recieved', data)
  })
  lib.typing().forEach(function(data) {
    console.log('typing', data)
  })

  return lib.isTyping()
})
.then(function() {
  console.log('done')
})
.catch(console.log)