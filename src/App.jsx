import React, { Component } from "react";
import GetProgress from "./Components/GetProgress.jsx";
import PostGoal from "./Components/PostGoal.jsx";
import Home from "./Components/Home.jsx";
import GetStatus from "./Components/GetStatus.jsx";
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {
  render = () => {
    return (
      <Router>
        <div>
          <Route path="/" exact={true} component={Home} />
          <Route path="/viewprogress" component={GetProgress} />
          <Route path="/setagoal" component={PostGoal} />
          <Route path="/friend" component={GetStatus} />
        </div>
      </Router>
    );
  };
}

export default App;
