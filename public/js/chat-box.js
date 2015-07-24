var ChatBox = React.createClass({
  getInitialState: function() {
    return {
      typing: false,
      inputValue: ''
    }
  },
  componentDidMount: function() {
    this.showContactTyping();
    this.detectTyping();
    this.sendMessages();
  },
  componentWillReceiveProps: function(newProps) {
    this.setState({typing: false});
  },
  showContactTyping: function() {
    var that = this;

    // when your contact is typing
    var isTypingStream = ChatServer
      .typing()
      .filter(function(user) {return user == that.props.currentUser})
      .map(function() {return true});

    var notTypingStream = isTypingStream
      .debounce(1500)
      .map(function(bool) {return !bool});

    var typingStream = Rx.Observable.merge(isTypingStream, notTypingStream);

    typingStream.forEach(function(isTyping) {
      that.setState({typing: isTyping})
    });
  },
  onKeyUpSubject: new Rx.Subject(),
  detectTyping: function() {
    var that = this;

    // when you are typing
    this.keyUpStream()
      .debounce(300)
      .filter(function(data) {return data[0] != 13})
      .forEach(function(data) {
        ChatServer.isTyping(that.props.currentUser);
      })
  },
  sendMessages: function() {
    var that = this;

    // for sending a message
    this.keyUpStream()
      .filter(function(data) {
        return data[0] === 13;
      })
      .forEach(function(data) {
        var message = data[1];
        ChatServer.sendMessage(that.props.currentUser, message);
        that.props.onMessageSent(message);
        that.setState({inputValue: '', typing: false});
      });
  },
  keyUpStream: function() {
    return this.onKeyUpSubject.asObservable()
  },
  onKeyUp: function(e) {
    this.onKeyUpSubject.onNext([e.keyCode, e.target.value]);
  },
  handleChange: function(e) {
    this.setState({inputValue: e.target.value});
  },
  render: function() {
    var that = this;

    var chatbox = (
      <div className="col-md-9">
        <div className="panel panel-primary">
            <div className="panel-heading">
                {this.props.currentUser}
            </div>
            <div className="panel-body">
                <ul className="chat clearfix">
                    {
                      this.props.messages && this.props.messages.map(function(msg, index) {
                        return <ChatBlock 
                          message={msg} 
                          myUsername={that.props.myUsername} 
                          currentUser={that.props.currentUser}
                          key={index} />
                      })
                    }
                </ul>
                <p className={"typing-state " + (this.state.typing ? "" : "v-hidden")}>{this.props.currentUser} is typing...</p>
            </div>
            <div className="panel-footer">
                <div className="input-group">
                    <input 
                      id="btn-input" 
                      type="text" 
                      className="form-control input" 
                      placeholder="Type your message here..."
                      ref="theInput"
                      value={this.state.inputValue}
                      onKeyUp={this.onKeyUp}
                      onChange={this.handleChange} />
                    <span className="input-group-btn">
                        <button className="btn btn-success" id="btn-chat">
                            Send</button>
                    </span>
                </div>
            </div>
        </div> 
      </div>
    )
    
    var noUser = (
      <div className="col-md-9">
        <h1>No Chats</h1>
      </div>
    )

    return this.props.currentUser ? chatbox : noUser;
  }
})



var ChatBlock = React.createClass({
  render: function() {
    var msg      = this.props.message;
    var name     = msg.from_self ? this.props.myUsername : this.props.currentUser;
    var cssClass = msg.from_self ? "right" : "left";
    
    return (
      <li className={"clearfix " + cssClass}>
        <span className={"chat-img pull-" + cssClass}>
          <span className="avatar">{name[0]}</span>
        </span>
        <div className="chat-body clearfix">
          <div className="header">
            <strong className="primary-font">{name}</strong>
            <small className="text-muted hide">
              <span className="fa fa-clock-o"></span>
              12 mins ago
            </small>
          </div>
          <p>
            {msg.message}
          </p>
        </div>
      </li>
    )
  }
})