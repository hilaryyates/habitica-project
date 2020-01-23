import React from "react";

export const getGoals = event => {
  return event["data"].map(tag => tag["name"]);
};

let getTaskProperty = (tasks, property) => {
  let properties = [];
  for (let task of tasks) {
    properties.push(task[property]);
  }
  return properties;
};

export const findHabiticaTag = (tags, goalInput) => {
  return tags.filter(tag => {
    if (goalInput.toUpperCase() === tag.toUpperCase()) {
      return tag;
    }
  })[0];
};

export const getRelevantProgress = (goalInputId, tasks) => {
  let tagIds = getTaskProperty(tasks, "tags");
  let relevantIds = tagIds.map(id => {
    if (id[0] === goalInputId) {
      return id[0];
    }
  });
  let relevantTasks = [];
  for (let task of tasks) {
    for (let tag of task.tags) {
      relevantIds.forEach(id => {
        if (tag === id) {
          relevantTasks.push(task);
        }
      });
    }
  }
  let set = new Set(relevantTasks);
  relevantTasks = Array.from(set);
  // console.log("Relevant tasks", relevantTasks);
  return relevantTasks;
};

export const postProgressToServer =
  // async
  progress => {
    let form = new FormData();
    form.append("progress", progress);
    // let postProgressResponse = await
    fetch("/PostProgress", {
      method: "POST",
      body: form
    });
    // let postProgressResponseText = await postProgressResponse.text();
    // let postProgressResponseBody = JSON.parse([postProgressResponseText]);
    // console.log("Post progress results", post);
  };

export const getDayToday = () => {
  let date = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  return days[date.getDay()];
};

// export const dailiesToText = tasks =>
//   tasks.slice(tasks.length - 1).map(daily => daily.text);

export const dateToString = date => {
  date = new Date(date);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  if (month < 10) month = "0" + month;
  let day = date.getDate();
  if (day < 10) day = "0" + day;
  return year + "-" + month + "-" + day;
};

export const monthMatch = (date1, date2) => {
  if (
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  ) {
    return true;
  }
};

export const getTasksThisMonth = habits => {
  let now = new Date();

  let tasksThisMonth = [];
  habits.forEach(habit => {
    habit.history.forEach(update => {
      let dateDone = new Date(update.date);
      if (monthMatch(now, dateDone)) {
        tasksThisMonth.push({
          dayOfTheMonth: dateDone.getDate(),
          task: habit.text,
          progressDay: true
        });
      }
    });
  });
  return tasksThisMonth;
};

export const getCompletedDailies = dailies => {
  let now = new Date();
  let todaysDate = now.getDate();
  if (dailies === undefined) return;
  let completedDailies = dailies.filter(daily => {
    if (daily.completed) {
      return daily;
    }
  });
  return completedDailies.map(daily => {
    return {
      dayOfTheMonth: todaysDate,
      task: daily.text,
      progressDay: true
    };
  });
};

export const getDaysTasksWereCompleted = (habits, dailies) => {
  const now = new Date();

  let beginningOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  beginningOfMonth = beginningOfMonth.getDate();
  let endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  endOfMonth = endOfMonth.getDate();

  let calendar = getTasksThisMonth(habits).concat(getCompletedDailies(dailies));
  let daysThisMonthWithTasks = [];
  calendar.forEach(day => daysThisMonthWithTasks.push(day.dayOfTheMonth));
  for (let i = beginningOfMonth; i <= endOfMonth; i++) {
    calendar.push({ dayOfTheMonth: i });
  }

  return calendar;
};

export const cleanCalendar = calendar => {
  calendar = calendar.sort((objA, objB) => {
    let dayOfTheMonthA = objA.dayOfTheMonth;
    let dayOfTheMonthB = objB.dayOfTheMonth;

    let comparison = 0;

    if (dayOfTheMonthA > dayOfTheMonthB) comparison = 1;
    if (dayOfTheMonthA < dayOfTheMonthB) comparison = -1;

    return comparison;
  });
  let calendarWithNoDuplicateDays = [];
  let flags = {};
  for (let i = 0; i < calendar.length; i++) {
    if (flags[calendar[i].dayOfTheMonth]) {
      continue;
    }
    flags[calendar[i].dayOfTheMonth] = true;
    flags[calendar[i].task] = true;
    calendarWithNoDuplicateDays.push(calendar[i]);
  }
  return calendarWithNoDuplicateDays;
};

// export const getDaysOfThisMonth = tasks => {
//   const now = new Date();

//   let beginningOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//   beginningOfMonth = beginningOfMonth.getDate();
//   let endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // subtracting 1 (0 is 1) from the first day of next month
//   endOfMonth = endOfMonth.getDate();

//   let dates = [];
//   for (let i = beginningOfMonth; i <= endOfMonth; i++) {
//     date.push(i);
//   }
//   console.log("DAYS WITH TASKS", dates);
//   return dates;
// };
