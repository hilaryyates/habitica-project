import React, { Component } from "react";
import { connect } from "react-redux";
import "../CSS/Status.css";
import PostMessage from "./PostMessage.jsx";
import PostGif from "./PostGif.jsx";
import FriendStatus from "./FriendStatus.jsx";
import Header from "./Header.jsx";
import { dateToElement } from "../Features/TaskFormatting.js";
// import GetMessages from "./GetMessages.jsx";
// import RenderMessages from "./RenderMessages.jsx";

class UnconnectedGetStatus extends Component {
  constructor(props) {
    super(props);
    this.state = { username: "" };
  }
  // componentWillUnmount = () => {
  //   this.props.dispatch({ type: "no-progress-retrieved" });
  // };
  handleSearch = event => {
    this.setState({ username: event.target.value });
  };
  handleSubmit = async event => {
    event.preventDefault();
    let progressForm = new FormData();
    progressForm.append("user", this.state.username);
    let progressResponse = await fetch("/GetProgress", {
      method: "POST",
      body: progressForm,
      credentials: "include"
    });
    let progressResponseText = await progressResponse.text();
    let progressResponseBody = JSON.parse(progressResponseText);
    console.log("FETCHED SERVER PROGRESS", progressResponseBody);
    if (progressResponseBody.success) {
      let progress = progressResponseBody.progress[0];
      // if (progress === undefined) throw "no progress";
      this.props.dispatch({
        type: "fetched-user",
        content: this.state.username
      });
      console.log("Fetched user", this.props.fetchedUser);

      this.props.dispatch({
        type: "store-friends-progress",
        content: progress
      });

      this.props.dispatch({ type: "progress-retrieved" });
      console.log(
        this.props.fetchedUser,
        this.props.friendsProgress,
        this.props.retrievedProgress
      );
    }
  };
  componentWillUnmount = () => {
    this.props.dispatch({ type: "no-progress-retrieved" });
  };
  // getDaysOfThisMonth = () => {
  //   const now = new Date();

  //   let beginningOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  //   beginningOfMonth = beginningOfMonth.getDate();
  //   let endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0) // subtracting 1 (0 is 1) from the first day of next month
  //   endOfMonth = endOfMonth.getDate();

  //   let date = [];
  //   for (let i = beginningOfMonth; i <= endOfMonth; i++) {
  //     date.push(i)
  //   }

  //   return date;
  // };

  render = () => {
    // if (!this.props.retrievedProgress) {
    //   return (
    //     <div className="progressBG">
    //       <Header />
    //       <div className="post-wrapper">
    //         <div className="text">Give a friend some encouragement!</div>
    //         {/* <div className="calendar">{this.getDaysOfThisMonth().map(dateToElement)}</div> */}
    //         <form onSubmit={this.handleSubmit}>
    //           <div className="submit-wrapper">
    //             <input type="text" onChange={this.handleSearch} />
    //             <input type="submit" value="Search" className="bigButton" />
    //           </div>
    //         </form>
    //       </div>
    //     </div>
    //   );
    // }
    return (
      <div className="progressBG">
        <Header />
        <FriendStatus />
        <div className="send-to-friend">
          <PostMessage />
          <PostGif />
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              onChange={this.handleSearch}
              defaultValue="Encourage a friend!"
              ref={input => (this.inputField = input)}
              onClick={() => (this.inputField.value = "")}
            />
            <input type="submit" value="Search" className="bigger-status-btn" />
          </form>
        </div>
      </div>
    );
  };
}
let mapStateToProps = state => {
  return {
    login: state.login,
    progress: state.progress,
    statusRetrieved: state.statusRetrieved,
    fetchedUser: state.fetchedUser,
    retrievedProgress: state.retrievedProgress,
    messages: state.messages,
    user: state.user,
    friendsProgress: state.friendsProgress
  };
};
let GetStatus = connect(mapStateToProps)(UnconnectedGetStatus);
export default GetStatus;
