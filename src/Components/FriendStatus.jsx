import { connect } from "react-redux";
import React, { Component } from "react";
import RenderMessages from "./RenderMessages.jsx";
import {
  getDaysTasksWereCompleted,
  cleanCalendar
} from "../Features/TaskFormatting.js";

class UnconnectedFriendStatus extends Component {
  super(props) {
    constructor(props);
    this.state = { friendDidDailies: undefined, friendDidHabits: undefined };
  }
  render() {
    let progress = this.props.friendsProgress;
    console.log("Progress in FriendStatus", progress);

    if (progress !== undefined) {
      let progressThisMonth = getDaysTasksWereCompleted(
        progress.habits,
        progress.dailies
      );

      let calendar = cleanCalendar(progressThisMonth);

      let daysThisMonthToElement = calendar => {
        if (calendar.progressDay) {
          return (
            <div className="calendar-element">
              <div className="date" className="progress-date">
                {calendar.dayOfTheMonth}
              </div>
              <div className="circle" className="progress-circle"></div>
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
      return (
        <div>
          <div className="tasksBG">
            <div>
              <div className="calendar">
                {calendar.map(daysThisMonthToElement)}
              </div>
              <span>
                <div>{calendar.map(tasksThisMonthToList)}</div>
                <div className="messages-header">Messages</div>
                <div className="messages-body">
                  <RenderMessages />
                </div>
              </span>
            </div>
          </div>
          <RenderMessages />
        </div>
      );
    }
    return <div>hello world</div>;
  }
}

let mapStateToProps = state => {
  return {
    friendsProgress: state.friendsProgress,
    retrievedProgress: state.retrievedProgress
  };
};
let FriendStatus = connect(mapStateToProps)(UnconnectedFriendStatus);

export default FriendStatus;
