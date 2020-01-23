import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedAvatar extends Component {
  componentDidMount = () => {
    console.log("INSIDE AVATAR");
  };
  render = () => {
    return (
      <div>
        {/* <div className="avatar-background"> */}
        <div className="avatar-letter">
          {this.props.user.name.slice(0, 1).toLowerCase()}
        </div>
        {/* </div> */}
      </div>
    );
  };
}

let mapStateToProps = state => {
  return { user: state.user };
};
let Avatar = connect(mapStateToProps)(UnconnectedAvatar);
export default Avatar;
