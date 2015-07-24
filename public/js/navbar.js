var Navbar = React.createClass({
  getInitialState: function() {
    return {
      myUsername: this.props.myUsername
    }
  },
  onUsernameChange: function(e) {
    this.setState({myUsername: e.target.value});
  },
  onSubmit: function(e) {
    e.preventDefault();
    ChatServer.setUsername(this.state.myUsername);
  },
  render: function() {
    return (
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">Chat</a>
          </div>  
          <div id="navbar" className="navbar-collapse collapse">
            <form className="navbar-form navbar-right" onSubmit={this.onSubmit}>
              <div className="form-group">
                <input 
                  type="text"
                  placeholder="Enter your name"
                  className="form-control"
                  value={this.state.myUsername}
                  onChange={this.onUsernameChange} />
              </div>
            </form>
          </div>
        </div>
      </nav>
    )
  }
});