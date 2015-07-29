var rxFromEvent   = Rx.Observable.fromEvent;
var rxCreate      = Rx.Observable.create;

var initSubject = new Rx.Subject();
var connections = new Rx.Subject();
var disconnections = new Rx.Subject();
var usernameChanges = new Rx.Subject();
var messages = new Rx.Subject();
var typing = new Rx.Subject();

var ChatServer = {
  init: function() {
    var client = this.client = io();

    client.on('error', initSubject.onError.bind(initSubject));

    client.on('chat details', initSubject.onNext.bind(initSubject));

    rxFromEvent(this.client, 'user connected').subscribe(connections);
    rxFromEvent(this.client, 'user disconnected').subscribe(disconnections);
    rxFromEvent(this.client, 'username changed').subscribe(usernameChanges);
    rxFromEvent(this.client, 'message').subscribe(messages);
    rxFromEvent(this.client, 'typing').subscribe(typing);
  },
  initStream: initSubject.asObservable(),
  connections: function() {
    return connections.asObservable();
  },
  disconnections: function() {
    return disconnections.asObservable();
  },
  usernameChanges: function() {
    return usernameChanges.asObservable();
  },
  messages: function() {
    return messages.asObservable();
  },
  typing: function() {
    return typing.asObservable();
  },
  setUsername: function(username) {
    var that = this;

    that.client.emit('username', username, function(response, error) {
    });
  },
  sendMessage: function(to, message) {
    var that = this;

    that.client.emit('message', {to: to, message: message}, function() {
    });
  },
  isTyping: function(to) {
    var that = this;
    that.client.emit('is typing', to, function() {
    });
  }
}