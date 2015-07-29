var appInitStream = ChatServer.initStream;

var connectionsStream = ChatServer.connections()
  .map(function(username) {return {op: 'Add', username: username}});

var disconnectionsStream = ChatServer.disconnections()
  .map(function(username) {return {op: 'Remove', username: username}});

var usernameChangeStream = ChatServer.usernameChanges()
  .map(function(change) {
    return _.extend(change, {op: 'Change'});
  })

var userEventsStream = Rx.Observable
  .merge(connectionsStream, disconnectionsStream, usernameChangeStream);

var onlineUsersStream = appInitStream.pluck('users')
  .merge(userEventsStream)
  .scan(function(users, ev) {
    switch (ev.op) {
      case 'Add':
        return users.concat(ev.username);
      case 'Remove':
        return _.without(users, ev.username);
      case 'Change':
        users[users.indexOf(ev.old_username)] = ev.new_username;
        return users;
    }

    return users;
  });