import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedSignup extends Component {
  constructor(props) {
    super(props);
    this.state = { id: "", token: "", username: "", password: "", name: "" };
  }
  componentDidMount = () => {
    console.log("INSIDE SIGNUP");
  };
  handleId = event => {
    this.setState({ id: event.target.value });
  };
  handleToken = event => {
    this.setState({ token: event.target.value });
  };
  handleUsername = event => {
    this.setState({ username: event.target.value });
  };
  handlePassword = event => {
    this.setState({ password: event.target.value });
  };
  handleName = event => {
    this.setState({ name: event.target.value });
  };
  handleSubmit = async event => {
    event.preventDefault();
    let form = new FormData();
    form.append("id", this.state.id);
    form.append("token", this.state.token);
    form.append("username", this.state.username);
    form.append("password", this.state.password);
    form.append("name", this.state.name);
    let res = await fetch("/Signup", { method: "POST", body: form });
    let resText = await res.text();
    let resBody = JSON.parse(resText);
    if (resBody.success) {
      this.props.dispatch({ type: "login" });
      this.props.dispatch({
        type: "current-user-is",
        content: {
          id: this.state.id,
          token: this.state.token,
          username: this.state.username,
          name: this.state.name
        }
      });
    }
  };

  render() {
    return (
      <div>
        <div className="signupHeader">
          <div>Sign Up</div>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className="signupFormContainer">
            <div className="homePrompt">What's your Habitica user ID?</div>
            <input
              defaultValue=""
              ref={input => (this.inputFieldId = input)}
              onClick={() => (this.inputFieldId.value = "")}
              type="text"
              onChange={this.handleId}
              className="signupInput"
            />
            <div className="homePrompt">What's your Habitica API token?</div>
            <input
              defaultValue=""
              ref={input => (this.inputFieldToken = input)}
              onClick={() => (this.inputFieldToken.value = "")}
              type="text"
              onChange={this.handleToken}
              className="signupInput"
            />
            <div className="homePrompt">Choose a username</div>
            <input
              defaultValue=""
              ref={input => (this.inputFieldUser = input)}
              onClick={() => (this.inputFieldUser.value = "")}
              type="text"
              onChange={this.handleUsername}
              className="signupInput"
            />
            <div className="homePrompt">Choose a password</div>
            <input
              defaultValue=""
              ref={input => (this.inputFieldPass = input)}
              onClick={() => (this.inputFieldPass.value = "")}
              type="text"
              onChange={this.handlePassword}
              className="signupInput"
            />
            <div className="homePrompt">What's your name?</div>
            <input
              defaultValue=""
              ref={input => (this.inputFieldName = input)}
              onClick={() => (this.inputFieldName.value = "")}
              type="text"
              onChange={this.handleName}
              className="signupInput"
            />
            <input type="submit" className="bigButton" />
          </div>
        </form>
      </div>
    );
  }
}

let Signup = connect()(UnconnectedSignup);
export default Signup;
