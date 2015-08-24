"use strict";

var React = require('react');

var Spaceship = React.createClass({

  getDefaultProps: function() {
    return {
      color: "#FFF",
      opacity: 0.9,
      radius: 50,
      theta: 0,
      x: 0,
      y: 0
    }
  },

  getRotationTransform: function() {
    return "rotate(" + this.props.theta + "deg)"
  },

  render: function() {
    var thisStyle = {
      position: "absolute",
      margin: 0,
      padding: 0,
      left: this.props.x,
      marginLeft: -this.props.radius / 2,
      top: this.props.y,
      marginTop: -this.props.radius / 3,
      transform: this.getRotationTransform(),
      fontSize: this.props.radius,
      color: this.props.color,
      opacity: this.props.opacity
    };
    return (
      <div style={thisStyle}>
        <span className="glyphicon glyphicon-menu-up"></span>
      </div>
    );
  }

});

module.exports = Spaceship;
