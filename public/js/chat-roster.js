var ChatRoster = React.createClass({
  getInitialState: function() {
    return {
      unreadNotifications: {}
    }
  },
  componentWillReceiveProps: function(newProps) {
    // if current user has changed, remove unread notifications
    // for the new user
    var unreadNotifications = this.state.unreadNotifications;

    if (newProps.currentUser != this.props.currentUser) {
      unreadNotifications[newProps.currentUser] = 0;
    }

    // if a new message has arrived, and it is not from the current user
    // add an unread notification for that user
    if (newProps.lastMessage !== this.props.lastMessage) {
      if (newProps.lastMessage.from != newProps.currentUser) {
        unreadNotifications[newProps.lastMessage.from] = 
          (unreadNotifications[newProps.lastMessage.from] || 0) + 1;
      }
    }

    this.setState({unreadNotifications: unreadNotifications});
  },
  onUserSelect: function(e) {
    this.props.onCurrentUserChange($(e.currentTarget).data('user'));
  },
  render: function() {
    var that = this;
    var currentUser = this.props.currentUser;
    var users = this.props.users; 

    return (
      <div className="col-xs-3">
        <div className="list-group">
          {
            users.map(function(user) {
              var unreadNotifications = that.state.unreadNotifications[user];
              return (
                <a  data-user={user} 
                    className={"list-group-item" + (user === currentUser ? ' active' : '')}
                    onClick={that.onUserSelect}
                    key={user}>
                  {user}
                  {unreadNotifications ? 
                    <span className="badge">{unreadNotifications}</span> : 
                    <div />}
                </a>
              )
            })
          }
        </div>
      </div>
    )
  }
})