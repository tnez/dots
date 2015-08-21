"use strict";

var React = require('react');

var Spaceship = React.createClass({

  getDefaultProps: function() {
    return {
      color: "#FFF",
      opacity: 0.9,
      size: "4em",
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
      left: this.props.x,
      top: this.props.y,
      transform: this.getRotationTransform(),
      fontSize: this.props.size,
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
