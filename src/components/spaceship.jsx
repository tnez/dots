"use strict";

var React = require('react');

var Spaceship = React.createClass({

  getDefaultProps: function() {
    return {
      color: "rgba(0,0,0,1)",
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
      color: this.props.color
    };
    return (
      <div style={thisStyle}>
        <span className="glyphicon glyphicon-menu-up"></span>
      </div>
    );
  }

});

module.exports = Spaceship;
