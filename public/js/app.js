var App = React.createClass({
  getInitialState: function() {
    return {
      users: [],
      initialized: false,
      currentUser: null,
      messages: {},
      myUsername: ''
    };
  },
  componentDidMount: function() {
    var that = this;

    ChatServer.init()
    .then(function(info) {
      that.setState({
        initialized: true,
        users: info.users,
        myUsername: info.username
      })
    });

    ChatServer.connections().forEach(function(info) {
      that.state.users.push(info.username)
      that.setState({users: that.state.users})
    });

    ChatServer.disconnections().forEach(function(user) {
      that.state.users.splice(that.state.users.indexOf(user), 1)
      that.setState({
        users: that.state.users,
        currentUser: that.state.currentUser == user ? null : that.state.currentUser
      })
    });

    // for receiving a message
    ChatServer.messages()
      .forEach(function(data) {
        var messages = that.initializeMessagesFor(data.from);

        messages[data.from].push({from_self: false, message: data.message});

        that.setState({messages: messages});
      });

    ChatServer.usernameChanges()
      .forEach(function(data) {
        var oldUsername = data.old_username;
        var newUsername = data.new_username;

        if (oldUsername == that.state.myUsername) {
          that.setState({myUsername: newUsername});
        } else {
          var users       = that.state.users;
          var messages    = that.state.messages;
          var currentUser = that.state.currentUser;

          if (users.indexOf(oldUsername) != -1) {
            users[users.indexOf(oldUsername)] = newUsername;
          }

          if (messages[oldUsername]) {
            messages[newUsername] = messages[oldUsername];
            delete messages[oldUsername];
          }

          if (currentUser === oldUsername) {
            currentUser = newUsername;
          }

          that.setState({
            users: users,
            messages: messages,
            currentUser: currentUser
          });
        }
      })
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
    messages[currentUser].push({from_self: true, message: message});

    this.setState({messages: messages});
  },
	render: function() {
    var that = this;
    var currentUser = this.state.currentUser;

    if (this.state.initialized) {
      return (
        <div>
          <Navbar myUsername={this.state.myUsername} />
          <div className="container" id="main-container">
            <div className="row">
              <ChatRoster 
                onCurrentUserChange={this.onCurrentUserChange} 
                users={this.state.users}
                currentUser={this.state.currentUser} />
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
        <h1>Loading</h1>
      )  
    }
	}
})

React.render(
  <App />,
  document.querySelector('body')
);