import React, { Component } from "react";
import { connect } from "react-redux";
import RenderMessages from "./RenderMessages.jsx";
import {
  getDaysTasksWereCompleted,
  cleanCalendar
} from "../Features/TaskFormatting.js";
import "../CSS/Status.css";

class UnconnectedStatus extends Component {
  constructor(props) {
    super(props);
  }
  // componentDidMount = () => {
  //   console.log("INSIDE STATUS");
  // };
  render() {
    let progress = this.props.progress;

    let progressThisMonth = getDaysTasksWereCompleted(
      progress.habits,
      progress.dailies
    );

    let calendar = cleanCalendar(progressThisMonth);

    // let daysWithTasks = progressThisMonth
    //   .filter(day => day.hasOwnProperty("task"))
    //   .map(task => task.dayOfTheMonth);

    let daysThisMonthToElement = calendar => {
      if (calendar.progressDay) {
        return (
          <div className="calendar-element">
            <div className="date" className="progress-date">
              {calendar.dayOfTheMonth}
            </div>
            <div className="circle" className="progress-circle"></div>
            {/* <div className="green-symbol"></div> */}
          </div>
        );
      }
      return (
        <div className="calendar-element">
          <div className="date">{calendar.dayOfTheMonth}</div>
          <div className="circle"></div>
        </div>
      );
    };

    let tasksThisMonthToList = calendar => {
      return (
        <div>
          <span className="day">{calendar.dayOfTheMonth}.</span>
          <span className="task">{calendar.task}</span>
          {calendar.dayOfTheMonth}
        </div>
      );
    };

    if (this.props.retrievedProgress) {
      return (
        <div>
          <div className="calendar">{calendar.map(daysThisMonthToElement)}</div>
          <span>
            <div>{calendar.map(tasksThisMonthToList)}</div>
            <div className="messages-header">Messages</div>
            <div className="messages-body">
              <RenderMessages />
            </div>
          </span>
        </div>
      );
    }
    return (
      <div>
        <div className="tasksBG">Search for progress</div>
      </div>
    );
  }
}
let mapStateToProps = state => {
  return {
    retrievedProgress: state.retrievedProgress,
    login: state.login,
    logout: state.logout,
    progress: state.progress,
    friendsProgress: state.friendsProgress
  };
};
let Status = connect(mapStateToProps)(UnconnectedStatus);
export default Status;
