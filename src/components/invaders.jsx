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
  },

  updateTimeElapsed: function() {
    this.setState({timeElapsed: new Date() - this.state.startTime});
  },

  getInitialState: function() {
    return {
      startTime: new Date(),
      timeElapsed: 0
    }
  },

  render: function() {
    return (
      <Scoreboard passedStyle={styles.scoreboard} timeElapsed={this.state.timeElapsed} />
      );
  }
});

module.exports = Invaders;
