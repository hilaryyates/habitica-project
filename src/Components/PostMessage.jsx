import React, { Component } from "react";
import { connect } from "react-redux";
import { getDayToday } from "../Features/TaskFormatting.js";

class UnconnectedPostMessage extends Component {
  constructor(props) {
    super(props);
    this.state = { message: "" };
  }
  componentDidMount = () => {
    console.log("INSIDE POST MESSAGE");
  };
  handleMessageSubmit = event => {
    console.log(
      "message for",
      this.props.fetchedUser,
      "from",
      this.props.user.name
    );
    event.preventDefault();
    let day = getDayToday();
    let form = new FormData();
    form.append("type", "message");
    form.append("isFor", this.props.fetchedUser);
    form.append("time", new Date());
    form.append("dayPosted", day);
    form.append("content", this.state.message);
    form.append("isFrom", this.props.user.username);
    fetch("/PostMessage", {
      method: "POST",
      body: form,
      credentials: "include"
    });
  };
  handleMessageChange = event => {
    this.setState({ message: event.target.value });
  };

  render() {
    return (
      <div className="BG">
        <form onSubmit={this.handleMessageSubmit}>
          <input
            type="text"
            onChange={this.handleMessageChange}
            defaultValue="Add a comment"
            ref={input => (this.inputField = input)}
            onClick={() => {
              this.inputField.value = "";
            }}
          />
          <input type="submit" value="Post" className="bigger-status-btn" />
        </form>
      </div>
    );
  }
}
let mapStateToProps = state => {
  return {
    user: state.user,
    fetchedUser: state.fetchedUser,
    messages: state.messages
  };
};
let PostMessage = connect(mapStateToProps)(UnconnectedPostMessage);
export default PostMessage;
