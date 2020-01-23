import React, { Component } from "react";
import "../CSS/style.css";
import { connect } from "react-redux";
import Header from "./Header.jsx";

class UnconnectedPostGoal extends Component {
  constructor(props) {
    super(props);
    this.state = { goal: "" };
  }
  componentDidMount = () => {
    console.log("INSIDE POST GOAL");
  };
  handleGoal = event => {
    this.setState({ goal: event.target.value });
  };
  handleSubmit = async event => {
    console.log(this.props.user.id, this.props.user.token);
    event.preventDefault();
    let headers = new Headers();
    headers.set("x-api-user", this.props.user.id);
    headers.set("x-api-key", this.props.user.token);
    headers.set("x-client", "Testing");
    headers.set("Content-Type", "application/json");
    let goal = this.state.goal;
    fetch("https://habitica.com/api/v3/tags", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ name: goal })
    });
  };
  successAlert = () => {
    alert(
      "Great! Add this tag to the tasks on Habitica which will help you achieve your goal. Then come back later to see what you've done."
    );
  };
  render() {
    return (
      <div>
        <Header />
        <div className="post-wrapper">
          <div className="text">
            What's something you'd like to accomplish or see yourself doing more
            of?
          </div>
          <form onSubmit={this.handleSubmit}>
            <div className="submit-wrapper">
              <input
                type="text"
                onChange={this.handleGoal}
                className="input-field"
              />
              <input
                type="submit"
                value="Submit"
                onClick={this.successAlert}
                className="bigButton"
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}
let mapStateToProps = state => {
  return { user: state.user };
};
let PostGoal = connect(mapStateToProps)(UnconnectedPostGoal);
export default PostGoal;
