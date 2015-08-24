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
    return "" + Math.floor(this.props.radius  / 2) + "px solid rgba(255,255,255,0.75)";
  },

  boxShadowDef: function() {
    var base = Math.floor(this.props.radius / 4);
    return "" + base + "px" + base + "px" + base*3 + "px rgba(255,255,255,0.5)";
  },

  render: function() {

    var dynamicStyle = {
      height: this.props.radius * 2,
      width: this.props.radius * 2,
      border: this.borderDef(),
      borderRadius: "50%",
      backgroundColor: this.props.color,
      boxShadow: this.boxShadowDef(),
      position: "absolute",
      top: this.props.y,
      left: this.props.x,
      margin: 0,
      padding: 0,
      marginTop: -this.props.radius,
      marginLeft: -this.props.radius
    };

    return (
      <div style={dynamicStyle}></div>
    );

  }
});

module.exports = Bubble;
