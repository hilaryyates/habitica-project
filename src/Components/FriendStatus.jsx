import React, { Component } from "react";
import RenderMessages from "./RenderMessages.jsx";
import { connect } from "react-redux";

class UnconnectedFriendStatus extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <div className="messages-header">
          Give {this.props.friend.toUpperCase()} some encouragement!
        </div>
        <RenderMessages />
      </div>
    );
  }
}

let mapStateToProps = state => {
  return { friend: state.fetchedUser };
};

let FriendStatus = connect(mapStateToProps)(UnconnectedFriendStatus);

export default FriendStatus;
