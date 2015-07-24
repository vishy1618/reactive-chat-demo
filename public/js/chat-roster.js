var ChatRoster = React.createClass({
  onUserSelect: function(e) {
    this.props.onCurrentUserChange($(e.currentTarget).data('user'));
  },
  render: function() {
    var that = this;
    var currentUser = this.props.currentUser;
    var users = this.props.users; 

    return (
      <div className="col-md-3">
        <div className="list-group">
          {
            users.map(function(user) {
              return (
                <a  data-user={user} 
                    className={"list-group-item" + (user === currentUser ? ' active' : '')}
                    onClick={that.onUserSelect}
                    key={user}>
                  {user}
                </a>
              )
            })
          }
        </div>
      </div>
    )
  }
})