"use strict";

var React = require('react');
var StyleSheet = require('react-style');
var Scoreboard = require('./scoreboard.jsx');

var styles = StyleSheet.create({
  scoreboard: {
    position: "absolute",
    top: "1em",
    right: "1em"
  }
});

var Invaders = React.createClass({

  componentDidMount: function() {
    let interval = 50;
    setInterval(this.updateTimeElapsed, interval);
    $(document.body).on('keydown', this.recordKeypress);
  },

  componentWillUnmount: function() {
    $(document.body).off('keydown', this.recordKeypress);
  },

  updateTimeElapsed: function() {
    this.setState({timeElapsed: new Date() - this.state.startTime});
  },

  getInitialState: function() {
    return {
      kbd: "",
      startTime: new Date(),
      timeElapsed: 0
    }
  },

  recordKeypress: function(event) {
    let spacebarKeyCode = 32;
    let leftKeyCode = 37;
    let rightKeyCode = 39;
    if (event.keyCode === spacebarKeyCode) {
      this.fire();
      return;
    }
    if (event.keyCode === leftKeyCode) {
      this.rotateLeft();
      return;
    }
    if (event.keyCode === rightKeyCode) {
      this.rotateRight();
      return;
    }
  },

  fire: function() {
    console.log("bang bang");
  },

  rotateLeft: function() {
    console.log("moving left");
  },

  rotateRight: function() {
    console.log("moving right");
  },

  render: function() {
    return (
      <Scoreboard passedStyle={styles.scoreboard} timeElapsed={this.state.timeElapsed} />
    );
  }
});

module.exports = Invaders;
