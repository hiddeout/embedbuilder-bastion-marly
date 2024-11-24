import React from 'react';

class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ''
    };
  }

  updateMessage(event) {
    this.setState({
      message: event.target.value
    });
  }

  render() {
    return(
      <div className="embed-group embed-message">
        <textarea
          name="message"
          placeholder="Message"
          maxLength="2000"
          rows="5"
          value={this.state.message}
          onChange={event => this.updateMessage(event)}
        >
        </textarea>
      </div>
    );
  }
}

export default Message;