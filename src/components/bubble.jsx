"use strict";

var React = require('react');

var Bubble = React.createClass({

  getDefaultProps: function() {
    return {
      x: 0,
      y: 0,
      radius: 50,
      color: "red"
    }
  },

  borderDef: function() {
    return "" + Math.floor(this.props.radius  / 4) + "px solid rgba(1,1,1,0.25)";
  },

  render: function() {

    var dynamicStyle = {
      height: this.props.radius * 2,
      width: this.props.radius * 2,
      border: this.borderDef(),
      borderRadius: "50%",
      backgroundColor: this.props.color,
      position: "absolute",
      top: this.props.y,
      left: this.props.x
    };

    return (
      <div style={dynamicStyle}></div>
    );

  }
});

module.exports = Bubble;
