import React, { Component } from "react";
import { connect } from "react-redux";
import Status from "./Status.jsx";
import "../CSS/style.css";
import Header from "./Header.jsx";
import {
  getGoals,
  findHabiticaTag,
  getRelevantProgress,
  postProgressToServer
} from "../Features/TaskFormatting";

class UnconnectedGetProgress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goalInput: "",
      goalInputId: undefined,
      tagsWithIds: undefined,
      goals: undefined
    };
  }
  componentDidMount = async () => {
    this.props.dispatch({
      type: "store-progress",
      content: { user: "", habits: [], dailies: [] }
    });

    console.log("INSIDE GET PROGRESS");

    let headers = new Headers();
    // console.log("User credentials", this.props.user.id, this.props.user.token);
    headers.set("x-api-user", this.props.user.id);
    headers.set("x-api-key", this.props.user.token);
    headers.set("x-client", "Testing");
    let tagsResponse = await fetch("https://habitica.com/api/v3/tags/", {
      headers: headers
    });
    let tagsResponseText = await tagsResponse.text();
    let tagsWithIds = JSON.parse(tagsResponseText);
    // console.log("Habitica tags", tagsWithIds);

    let goals = getGoals(tagsWithIds);

    this.setState({ tagsWithIds: tagsWithIds });
    this.setState({ goals: goals });
  };

  handleGoalInput = event => {
    this.setState({ goalInput: event.target.value });
  };
  handleSubmit = async event => {
    event.preventDefault();
    let allGoals = this.state.goals;
    let goalInput = this.state.goalInput;
    let goal = findHabiticaTag(allGoals, goalInput);
    // console.log("GOAL", goal);

    if (goal !== undefined) {
      let form = new FormData();
      form.append("tag", goal);
      let tagData = JSON.stringify(this.state.tagsWithIds);
      form.append("tagData", tagData);
      let goalTasksResponse = await fetch("/TasksFromGoal", {
        method: "POST",
        body: form
      });
      let goalTasksResponseText = await goalTasksResponse.text();
      let goalTasksResponseBody = JSON.parse(goalTasksResponseText);
      if (goalTasksResponseBody.success) {
        this.setState({ goalInputId: goalTasksResponseBody.tagId });
      }
    } else {
      throw "This tag doesn't exist on Habitica";
    }

    let taskProgressURL = new URL(
      'https://habitica.com/api/v3/tasks/user?"type"="String"'
    );
    let taskProgressParams = {
      key: "type",
      value: "String",
      Description: "completedTodos"
    };
    taskProgressURL.search = new URLSearchParams(taskProgressParams);
    let headers = new Headers();
    headers.set("x-api-user", this.props.user.id);
    headers.set("x-api-key", this.props.user.token);
    headers.set("x-client", "Testing");
    let taskProgressResponse = await fetch(taskProgressURL, {
      headers: headers
    });
    let taskProgressResponseText = await taskProgressResponse.text();
    let taskProgressResponseBody = JSON.parse(taskProgressResponseText);
    // console.log("Habitica progress response body", taskProgressResponseBody);

    if (!taskProgressResponseBody.success)
      throw "Error getting Habitica progress";
    let tasks = Object.entries(taskProgressResponseBody);
    let taskData = tasks[1][1];

    let habitsAndDailies = getRelevantProgress(
      this.state.goalInputId,
      taskData
    );
    let habits = habitsAndDailies.filter(task => task.type === "habit");
    let dailies = habitsAndDailies.filter(task => task.type === "daily");

    let progressBreakdown = {
      user: this.props.user.username,
      habits: habits,
      dailies: dailies
    };
    // console.log("Progress breakdown", progressBreakdown);

    this.props.dispatch({
      type: "store-progress",
      content: progressBreakdown
    });

    this.props.dispatch({ type: "progress-retrieved" });

    let stringifiedprogress = JSON.stringify(progressBreakdown);
    postProgressToServer(stringifiedprogress);
  };
  componentWillUnmount = () => {
    this.props.dispatch({ type: "no-progress-retrieved" });
  };
  render = () => {
    if (this.props.retrievedProgress) {
      return (
        <div className="progressBG">
          <Header />
          <Status />
        </div>
      );
    }
    return (
      <div className="progressBG">
        <Header />
        <Status />
        <div className="post-wrapper">
          <div className="text">
            Check to see how much progress you've made!
          </div>
          <form onSubmit={this.handleSubmit}>
            <div className="submit-wrapper">
              <input
                type="text"
                onChange={this.handleGoalInput}
                className="input-getProgress"
              />
              <input
                type="submit"
                value="Check progress"
                className="bigButton"
              />
            </div>
          </form>
        </div>
      </div>
    );
  };
}
let mapStateToProps = state => {
  return {
    user: state.user,
    tags: state.tags,
    progress: state.progress,
    login: state.login,
    user: state.user,
    fetchedUser: state.fetchedUser,
    retrievedProgress: state.retrievedProgress
  };
};
let GetProgress = connect(mapStateToProps)(UnconnectedGetProgress);
export default GetProgress;
