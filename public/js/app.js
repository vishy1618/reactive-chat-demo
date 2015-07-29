var App = React.createClass({
  getInitialState: function() {
    return {
      users: [],
      initialized: false,
      currentUser: null,
      messages: {},
      myUsername: '',
      lastMessage: {}
    };
  },
  componentDidMount: function() {
    this.initializeApp();
    this.handleIncomingMessages();
    this.handleUsernameChanges();
  },
  initializeApp: function() {
    var that = this;

    ChatServer.init();

    appInitStream.subscribe(function(info) {
      that.setState({
        initialized: true,
        myUsername: info.username
      })
    });

    onlineUsersStream.subscribe(function(users) {
      that.setState({
        users: users,
        totalUsers: users.length
      });
    });
  },
  handleIncomingMessages: function() {
    var that = this;

    // for receiving a message
    ChatServer.messages()
      .subscribe(function(data) {
        var messages = that.initializeMessagesFor(data.from);

        messages[data.from] = messages[data.from].concat({from_self: false, message: data.message});

        that.setState({messages: messages, lastMessage: data});
      });
  },
  handleUsernameChanges: function() {
    var that = this;
    
    usernameChangeStream
      .forEach(function(data) {
        var oldUsername = data.old_username;
        var newUsername = data.new_username;

        var messages    = that.state.messages;
        var currentUser = that.state.currentUser;

        if (messages[oldUsername]) {
          messages[newUsername] = messages[oldUsername];
          delete messages[oldUsername];
        }

        if (currentUser === oldUsername) {
          currentUser = newUsername;
        }

        that.setState({
          messages: messages,
          currentUser: currentUser
        });
      })
  },
  onMyUsernameChange: function(username) {
    ChatServer.setUsername(username);
    this.setState({myUsername: username});
  },
  onCurrentUserChange: function(user) {
    this.setState({currentUser: user})
  },
  initializeMessagesFor: function(username) {
    var messages = this.state.messages;
    messages[username] = messages[username] || [];

    return messages;
  },
  onMessageSent: function(message) {
    var currentUser = this.state.currentUser;
    var messages = this.initializeMessagesFor(currentUser);
    messages[currentUser] = messages[currentUser].concat({from_self: true, message: message});

    this.setState({messages: messages});
  },
	render: function() {
    var that = this;
    var currentUser = this.state.currentUser;

    if (this.state.initialized) {
      return (
        <div>
          <Navbar 
            myUsername={this.state.myUsername}
            onMyUsernameChange={this.onMyUsernameChange} />
          <div className="container" id="main-container">
            <div className="row">
              <div className="col-md-3">
                  <p className="users-online">Users online: {this.state.users.length}</p>
              </div>
              <div className="col-md-9">
              </div>
            </div>
            <div className="row">
              <ChatRoster 
                onCurrentUserChange={this.onCurrentUserChange} 
                users={this.state.users}
                currentUser={this.state.currentUser}
                lastMessage={this.state.lastMessage} />
              {
                currentUser
                ? 
                <ChatBox 
                  currentUser={this.state.currentUser}
                  myUsername={this.state.myUsername}
                  onMessageSent={this.onMessageSent}
                  messages= {this.state.messages[currentUser]} />
                :
                <div />
              }
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <h1 className="animated zoomIn">Firing up!</h1>
      )  
    }
	}
})

React.render(
  <App />,
  document.querySelector('body')
);