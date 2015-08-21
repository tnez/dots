"use strict";

var _ = require('lodash');
var React = require('react');
var StyleSheet = require('react-style');
var Scoreboard = require('./scoreboard.jsx');
var Bubble = require('./bubble.jsx');
var Spaceship = require('./spaceship.jsx');

var styles = StyleSheet.create({
  scoreboard: {
    position: "absolute",
    top: "1em",
    right: "1em"
  }
});

var Invaders = React.createClass({

  addNewBubble: function() {
    // copy bubble array, getting rid of any that have fallen out of
    // the screen to prevent this thing from slowing to a halt as we let
    // it run
    var newBubbles = _.filter(this.state.bubbles, function(bubbleData) {
      return bubbleData.y <= 1000;
    });
    if (newBubbles.length < this.state.maxBubbles) {
      var x = Math.floor(Math.random() * 600);
      var y = 0;
      var xVelo = (Math.random() - 0.5) / 5;
      var yVelo = (Math.random() / 2) / 5;
      var t = this.state.timeElapsed;
      var bubbleData = {
        x0: x,
        x: x,
        y0: y,
        y: y,
        xVelo: xVelo,
        yVelo: yVelo,
        radius: yVelo * 500,
        color: _.sample(this.props.colors),
        t0: t,
        t: t
      };
      newBubbles.push(bubbleData);
    }
    this.setState({bubbles: newBubbles});
    console.log(this.state.bubbles);
  },

  updateBubblePos: function(bubbleData, timeElapsed) {
    var delta = timeElapsed - bubbleData.t;
    var newX = bubbleData.x + delta * bubbleData.xVelo;
    var newY = bubbleData.y + delta * bubbleData.yVelo;
    var newT = timeElapsed;
    var newXVelo = newX < 0 || newX + bubbleData.radius * 2 > this.state.boardWidth ?
                 -bubbleData.xVelo : bubbleData.xVelo;
    var newYVelo = newY < 0 || newY + bubbleData.radius * 2 > this.state.boardHeight ?
                 -bubbleData.yVelo : bubbleData.yVelo;
    // add randomness
    newXVelo += (Math.random() - 0.5) / 75;
    newYVelo += (Math.random() - 0.5) / 75;
    return _.merge(bubbleData, {x: newX, xVelo: newXVelo,
                                y: newY, yVelo: newYVelo,
                                t: newT});
  },

  componentDidMount: function() {
    let interval = 5;
    this.updateBoardDimensions();
    $(window).resize(this.updateBoardDimensions);
    setInterval(this.updateTimeElapsed, interval);
    setInterval(this.addNewBubble, 600);
    $(document.body).on('keydown', this.recordKeypress);
  },

  componentWillUnmount: function() {
    $(document.body).off('keydown', this.recordKeypress);
  },

  updateBoardDimensions: function(event) {
    console.log("Window dims: " + $(window).width() + ", " + $(window).height());
    this.setState({
      boardHeight: $(window).height(),
      boardWidth: $(window).width()
    });
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
      boardHeight: $(window).height(),
      boardWidth: $(window).width(),
      spaceshipX: 600,
      spaceshipY: 400,
      spaceshipTheta: 0,
      kbd: "",
      maxBubbles: 5,
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
    let upKeyCode = 38;        
    let downKeyCode = 40;
    if (event.keyCode === spacebarKeyCode) {
      this.fire();
      return;
    }
    if (event.keyCode === leftKeyCode) {
      if (event.shiftKey) {
        this.rotateLeft();
      } else {
        this.moveLeft();
      }
      event.preventDefault();
      return;
    }
    if (event.keyCode === rightKeyCode) {
      if (event.shiftKey) {
        this.rotateRight();
      } else {
        this.moveRight();
      }
      event.preventDefault();
      return;
    }
    if (event.keyCode === upKeyCode) {
      this.moveUp();
      event.preventDefault();
    }
    if (event.keyCode === downKeyCode) {
      this.moveDown();
      event.preventDefault();
    }
  },

  fire: function() {
    console.log("bang bang");
    event.preventDefault();
  },

  rotateLeft: function() {
    let incrementFactor = 5;
    this.setState({spaceshipTheta: this.state.spaceshipTheta - 1 * incrementFactor});
  },

  rotateRight: function() {
    let incrementFactor = 10;
    this.setState({spaceshipTheta: this.state.spaceshipTheta + 1 * incrementFactor});
  },
  

  moveLeft: function() {
    let incrementFactor = 20;
    this.setState({spaceshipX: this.state.spaceshipX - 1 * incrementFactor});
  },

  moveRight: function() {
    let incrementFactor = 20;
    this.setState({spaceshipX: this.state.spaceshipX + 1 * incrementFactor});
  },

  moveUp: function() {
    let incrementFactor = 20;
    this.setState({spaceshipY: this.state.spaceshipY - 1 * incrementFactor});
  },

  moveDown: function() {
    let incrementFactor = 20;
    this.setState({spaceshipY: this.state.spaceshipY + 1 * incrementFactor});
  },
  
  render: function() {
    return (
      <div>
        <Scoreboard passedStyle={styles.scoreboard} timeElapsed={this.state.timeElapsed} />
        { _.map(this.state.bubbles, function(data) {
          return ( <Bubble x={data.x} y={data.y} radius={data.radius} color={data.color} /> );
         })
         }
        <Spaceship x={this.state.spaceshipX} y={this.state.spaceshipY} theta={this.state.spaceshipTheta} />
      </div>
    );
  }
});

module.exports = Invaders;
