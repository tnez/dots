"use strict";

var _ = require('lodash');
var React = require('react');
var StyleSheet = require('react-style');
var Scoreboard = require('./scoreboard.jsx');
var Bubble = require('./bubble.jsx');

var styles = StyleSheet.create({
  scoreboard: {
    position: "absolute",
    top: "1em",
    right: "1em"
  }
});

var Invaders = React.createClass({

  addNewBubble: function() {
    var x = Math.floor(Math.random() * 600);
    var y = 0;
    var xVelo = (Math.random() - 0.5) / 100;
    var yVelo = (Math.random() / 2) / 100;
    var t = this.state.timeElapsed;
    var bubbleData = {
      x0: x,
      x: x,
      y0: y,
      y: y,
      xVelo: xVelo,
      yVelo: yVelo,
      radius: yVelo * 10000,
      color: _.sample(this.props.colors),
      t0: t,
      t: t
    };
    var newBubbles = this.state.bubbles;
    newBubbles.push(bubbleData);
    this.setState({bubbles: newBubbles});
    console.log(this.state.bubbles);
  },

  updateBubblePos: function(bubbleData, timeElapsed) {
    var delta = timeElapsed - bubbleData.t;
    var newX = bubbleData.x + delta * bubbleData.xVelo;
    var newY = bubbleData.y + delta * bubbleData.yVelo;
    var newT = this.state.elapsedTime;
    return _.merge(bubbleData, {x: newX, y: newY, t: newT});
  },

  componentDidMount: function() {
    let interval = 5;
    setInterval(this.updateTimeElapsed, interval);
    setInterval(this.addNewBubble, 600);
    console.log(this.state.bubbles);
    $(document.body).on('keydown', this.recordKeypress);
  },

  componentWillUnmount: function() {
    $(document.body).off('keydown', this.recordKeypress);
  },

  updateTimeElapsed: function() {
    var timeElapsed = new Date() - this.state.startTime;
    var updateBubbleFunc = this.updateBubblePos;
    this.setState({timeElapsed: timeElapsed,
                   bubbles: _.map(this.state.bubbles, function(bubble) {
                     return updateBubbleFunc(bubble, timeElapsed);
                   })});
  },

  getInitialState: function() {
    return {
      bubbles: [],
      bubbleIdx: 0,
      kbd: "",
      startTime: new Date(),
      timeElapsed: 0
    }
  },

  getDefaultProps: function() {
    return {
      colors: ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
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
      <div>
        <Scoreboard passedStyle={styles.scoreboard} timeElapsed={this.state.timeElapsed} />
        { _.map(this.state.bubbles, function(data) {
          return ( <Bubble x={data.x} y={data.y} radius={data.radius} color={data.color} /> );
         })
        }
      </div>
    );
  }
});

module.exports = Invaders;
