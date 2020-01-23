import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedGetMessages extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    let updateMessages = async () => {
      // console.log("Fetching MESSAGES for", this.props.fetchedUser);

      let form = new FormData();
      form.append("isFor", this.props.fetchedUser);

      let messagesResponse = await fetch("/GetMessages", {
        method: "POST",
        body: form
      });
      let messagesResponseText = await messagesResponse.text();
      let messagesResponseBody = JSON.parse(messagesResponseText);
      let messages = messagesResponseBody.messages;
      // console.log("Messages from server", messages);
      if (messagesResponseBody.success) {
        this.props.dispatch({
          type: "get-messages",
          content: messages
        });
        // console.log("Messages in store", this.props.messages);
      }
    };
    setInterval(updateMessages, 500);
  }
  render() {
    return null;
  }
}
let mapStateToProps = state => {
  return {
    user: state.user,
    fetchedUser: state.fetchedUser,
    messages: state.messages,
    retrievedProgress: state.retrievedProgress
  };
};
let GetMessages = connect(mapStateToProps)(UnconnectedGetMessages);
export default GetMessages;
