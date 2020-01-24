import React, { Component } from "react";
import { connect } from "react-redux";
import GetMessages from "./GetMessages.jsx";
import "../CSS/Status.css";

class UnconnectedRenderMessages extends Component {
  constructor(props) {
    super(props);
  }
  handleDeleteMessage = async (time, isFrom, isFor) => {
    console.log("delete message from and for", isFrom, isFor, "sent at", time);
    let form = new FormData();
    form.append("time", time);
    form.append("isFor", this.props.fetchedUser);
    form.append("isFrom", isFrom);

    let deleteMessageResponse = await fetch("/DeleteMessage", {
      method: "POST",
      body: form
    });
  };
  render() {
    let messageToElement = event => {
      if (event.type === "gif") {
        return (
          <div className="messages">
            <span>
              <span className="isFrom">{event.isFrom}</span>
              <span>
                <img className="gif" key={event.content} src={event.content} />
                <button
                  className="status-btn"
                  onClick={() =>
                    this.handleDeleteMessage(
                      event.time,
                      event.isFrom,
                      event.isFor
                    )
                  }
                >
                  delete gif
                </button>
              </span>
            </span>
            <div className="dayPosted">{event.dayPosted}</div>
          </div>
        );
      }
      if (event.type === "message") {
        return (
          <div className="messages">
            <span className="isFrom">{event.isFrom}</span>
            <span className="post">
              <span className="post-content">{event.content}</span>
              <button
                className="status-btn"
                onClick={() =>
                  this.handleDeleteMessage(
                    event.time,
                    event.isFrom,
                    event.isFor
                  )
                }
              >
                delete
              </button>
            </span>
            <div className="dayPosted">{event.dayPosted}</div>
          </div>
        );
      }
    };
    return (
      <div>
        <div className="posts-header">Messages</div>
        <GetMessages />
        <div className="all-posts">
          {this.props.messages.map(messageToElement)}
        </div>
      </div>
    );
  }
}

let mapStateToProps = state => {
  return {
    messages: state.messages,
    fetchedUser: state.fetchedUser,
    user: state.user
  };
};
let RenderMessages = connect(mapStateToProps)(UnconnectedRenderMessages);
export default RenderMessages;
