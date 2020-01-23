import React, { Component } from "react";
import { connect } from "react-redux";
import "../CSS/GIF.css";
import { getDayToday } from "../Features/TaskFormatting.js";

class UnconnectedPostGif extends Component {
  constructor(props) {
    super(props);
    this.state = { gifQuery: "", showGifs: false, urls: [] };
  }
  componentDidMount = () => {
    console.log("INSIDE POST GIF");
  };
  handleQuery = event => {
    this.setState({ gifQuery: event.target.value });
  };
  handleSubmit = async event => {
    event.preventDefault();
    let form = new FormData();
    form.append("gif", this.state.gifQuery);
    let gifResponse = await fetch("/PostGif", { method: "POST", body: form });
    let gifResponseText = await gifResponse.text();
    let gifResponseBody = JSON.parse(gifResponseText);
    if (gifResponseBody.success) {
      let urls = gifResponseBody.gifData.data.map(
        data => data.images.original.url
      );
      this.setState({ urls: urls });
      this.setState({ showGifs: true });
    }
  };
  handleChosenGif = source => {
    let day = getDayToday();
    console.log(
      "New gif object",
      source,
      "sender",
      this.props.user.name,
      day,
      "for",
      this.props.fetchedUser
    );
    let form = new FormData();
    form.append("type", "gif");
    form.append("isFor", this.props.fetchedUser);
    form.append("time", new Date());
    form.append("dayPosted", day);
    form.append("content", source);
    form.append("isFrom", this.props.user.name);
    fetch("/PostMessage", {
      method: "POST",
      body: form,
      credentials: "include"
    });
    this.setState({ showGifs: false });
  };
  render() {
    let urlToGif = url => {
      return (
        <img
          className="gif"
          key={url}
          src={url}
          onClick={() => this.handleChosenGif(url)}
        />
      );
    };

    if (this.state.showGifs) {
      return (
        <div className="BG">
          <div>{this.state.urls.map(urlToGif)}</div>
        </div>
      );
    }
    return (
      <div className="BG">
        <form onSubmit={this.handleSubmit}>
          <i className="search-icon"></i>
          <input
            className="inputField"
            onChange={this.handleQuery}
            defaultValue="Send a GIF"
            ref={input => (this.inputField = input)}
            onClick={() => (this.inputField.value = "")}
          />
          <input type="submit" value="" className="bigger-status-btn" />
        </form>
      </div>
    );
  }
}
let mapStateToProps = state => {
  return {
    urls: state.gifUrls,
    user: state.user,
    fetchedUser: state.fetchedUser
  };
};
let PostGif = connect(mapStateToProps)(UnconnectedPostGif);
export default PostGif;
