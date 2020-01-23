import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Signup from "./Signup.jsx";
import Login from "./Login.jsx";
import Header from "./Header.jsx";
import "../CSS/Home.css";
import "../CSS/Header.css";
import "../CSS/style.css";
import Avatar from "./Avatar.jsx";

class UnconnectedHome extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount = () => {
    console.log("INSIDE HOME");
    this.props.dispatch({ type: "no progress-retrieved" });
  };

  handleLogout = () => {
    this.props.dispatch({ type: "logout" });
    console.log("Logout");
  };
  clearDatabase = () => {
    fetch("/ClearDatabase");
    console.log("Database clear");
  };
  lookForMyMessages = () => {
    this.props.dispatch({
      type: "fetched-user",
      content: this.props.user.username
    });
  };
  newMyProgressSearch = () => {
    console.log("NEW My Progress Search ");
    this.props.dispatch({ type: "no-progress-retrieved" });
  };
  newFriendProgressSearch = () => {
    console.log("NEW Friend Progress Search");
    this.props.dispatch({ type: "no-progress-retrieved" });
  };
  render() {
    if (this.props.login && this.props.user !== undefined) {
      return (
        <div className="welcomeBG">
          <div>
            <Header />
            <div className="logout-button-wrapper">
              <button
                onClick={this.handleLogout}
                className="smallButton"
                logout-
              >
                Logout
              </button>
            </div>
          </div>
          <div className="welcomeUserWrapper">
            <div className="avatar-wrapper-home">
              <Avatar />
            </div>
            <div className="welcomeText">
              Welcome {this.props.user.name}! What would you like to do?
            </div>
          </div>

          <div className="welcomeLinksWrapper">
            <Link to="/setagoal" className="link">
              Set a new goal
            </Link>
            <Link
              to="/viewprogress"
              className="link"
              onClick={this.newMyProgressSearch}
              onClick={this.lookForMyMessages}
            >
              View your progress
            </Link>
            <Link
              to="/friend"
              className="link"
              onClick={this.newFriendProgressSearch}
            >
              Encourage a friend
            </Link>
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="signupLoginBG">
          <Header />
          <Signup />
          <Login />
          {/* <button onClick={this.clearDatabase}>Clear database</button> */}
        </div>
      </div>
    );
  }
}
let mapStateToProps = state => {
  return {
    login: state.login,
    user: state.user,
    retrievedProgress: state.retrievedProgress
  };
};

let Home = connect(mapStateToProps)(UnconnectedHome);
export default Home;
