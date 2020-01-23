import "../CSS/Header.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class UnconnectedHeader extends Component {
  componentDidMount = () => {
    console.log("INSIDE HEADER");
  };
  render = () => {
    if (this.props.login) {
      return (
        <div>
          <div className="header-wrapper">
            <Link to="/" className="header">
              Habitica Goals
            </Link>
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="header-logged-out">Habitica Goals</div>
      </div>
    );
  };
}
let mapStateToProps = state => {
  return { user: state.user, login: state.login };
};
let Header = connect(mapStateToProps)(UnconnectedHeader);
export default Header;
