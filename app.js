var express   = require('express')
var socketio  = require('socket.io')
var server    = require('./server')

const PORT = 3000

var app = express()

app.use(express.static('public'))

var http = require('http').Server(app)
var io  = socketio(http)

http.listen(PORT, function () {
  console.log('app running on port %s', PORT)
})

server(io)