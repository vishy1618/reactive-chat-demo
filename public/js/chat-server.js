var ChatServer = {
  init: function() {
    var client = this.client = io("http://localhost:3000")

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
  }
}