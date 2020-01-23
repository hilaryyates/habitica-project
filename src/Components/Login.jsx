import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedLogin extends Component {
  constructor(props) {
    super(props);
    this.state = { username: "", password: "" };
  }
  componentDidMount = () => {
    console.log("INSIDE LOGIN");
    this.props.dispatch({ type: "fetched-user", content: undefined });
  };
  handleUsername = event => {
    this.setState({ username: event.target.value });
  };
  handlePassword = event => {
    this.setState({ password: event.target.value });
  };
  handleSubmit = async event => {
    event.preventDefault();
    let form = new FormData();
    form.append("username", this.state.username);
    form.append("password", this.state.password);
    let loginResponse = await fetch("/Login", {
      method: "POST",
      body: form,
      credentials: "include"
    });
    let loginResponseText = await loginResponse.text();
    let loginResponseBody = JSON.parse(loginResponseText);
    console.log("Login body: ", loginResponseBody);
    if (loginResponseBody.success) {
      let user = loginResponseBody.user;
      this.props.dispatch({ type: "login" });
      this.props.dispatch({
        type: "current-user-is",
        content: {
          id: user.id,
          token: user.token,
          username: user.username,
          name: user.name
        }
      });
    }
    if (!loginResponseBody.success) console.log("Login failed");
  };
  render = () => {
    return (
      <div>
        <div className="loginHeader">
          <div>Log In</div>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className="loginFormContainer">
            <div className="homePrompt">What's your username?</div>
            <input
              className="loginInput"
              type="text"
              onChange={this.handleUsername}
              defaultValue=""
              ref={input => (this.inputFieldUser = input)}
              onClick={() => (this.inputFieldUser.value = "")}
            />
            <div className="homePrompt">What's your password?</div>
            <input
              type="text"
              onChange={this.handlePassword}
              defaultValue=""
              ref={input => (this.inputFieldPass = input)}
              onClick={() => (this.inputFieldPass.value = "")}
              className="loginInput"
            />
            <input type="submit" className="bigButton" />
          </div>
        </form>
      </div>
    );
  };
}
let mapStateToProps = state => {
  return { login: state.login, user: state.user };
};
let Login = connect(mapStateToProps)(UnconnectedLogin);
export default Login;
