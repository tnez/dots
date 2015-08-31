"use strict";

var _ = require('lodash');
var React = require('react');
var StyleSheet = require('react-style');
var Instructions = require('./instructions.jsx');
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
      var xVelo = (Math.random() - 0.5) / 5;
      var yVelo = (Math.random() / 2) / 5;
      var radius = 25 + Math.random() * 25;
      var x = Math.random() * (this.state.boardWidth - radius * 2);
      var y = 0;
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
  },

  updateBubblePos: function(bubbleData, timeElapsed) {
    var delta = timeElapsed - bubbleData.t;
    var newX = bubbleData.x + delta * bubbleData.xVelo;
    var newY = bubbleData.y + delta * bubbleData.yVelo;
    var newT = timeElapsed;
    var newXVelo = bubbleData.xVelo;
    var newYVelo = bubbleData.yVelo;
    if (newX < 0 || newX + bubbleData.radius * 2 > this.state.boardWidth ) {
          newX = newXVelo < 0 ? 0 : this.state.boardWidth - bubbleData.radius * 2;
          newXVelo = -newXVelo;
    } else {
      newXVelo += (Math.random() - 0.5) / 75;
    }
    if (newY < 0 || newY + bubbleData.radius * 2 > this.state.boardHeight ) {
          newY = newYVelo < 0 ? 0 : this.state.boardHeight - bubbleData.radius * 2;
          newYVelo = -newYVelo;
    } else {
      newYVelo += (Math.random() - 0.5) / 75;
    }
    return _.merge(bubbleData, {x: newX, xVelo: newXVelo,
                                y: newY, yVelo: newYVelo,
                                t: newT});
  },

  updateSpaceshipPos: function() {
    if (this.state.isFiring) {
      var speedBoost = 3;
      var theta = this.state.spaceshipTheta / 180 * Math.PI;
      var yVelo = -Math.cos(theta) * speedBoost;
      var xVelo = Math.sin(theta) * speedBoost;
      var newX = this.state.spaceshipX + xVelo * 0.5;
      var newY = this.state.spaceshipY + yVelo * 0.5 ;
      // TODO: remove hardcoded 60 and take into account spaceship width
      if (newX <= 0 || newX >= this.state.boardWidth - 60) {
        var newTheta = newX <= 0 ? 90 : -90;
        this.setState({spaceshipTheta: newTheta, isFiring: false});
        return;
      }
      if(newY <= 0 || newY >= this.state.boardHeight -  60) {
        var newTheta = newY <= 0 ? 180 : 0;
        this.setState({spaceshipTheta: newTheta, isFiring: false});
        return;
      }
      // otherwise, normal case
      this.setState({
        spaceshipX: newX,
        spaceshipY: newY
      });
    }
  },

  detectCollisions: function() {
    var spaceshipX = this.state.spaceshipX;
    var spaceshipY = this.state.spaceshipY;
    var collisions = _.filter(this.state.bubbles, function(bubble) {
      var dist = Math.sqrt(Math.pow(bubble.x - spaceshipX, 2) +
                           Math.pow(bubble.y - spaceshipY, 2));
      return dist < bubble.radius;
    });
    if (collisions.length > 0) {
      this.setState({isRunning: false});
      _.forEach(collisions, function(bubble) {
        // here we would handle the collisions based on the bubble type
      })
    }
  },

  mainEventLoop: function() {
    if (this.state.isRunning) {
      this.updateTimeElapsed();
      this.updateSpaceshipPos();
      this.detectCollisions();
      this.updateScore();
    }
  },

  componentDidMount: function() {
    this.updateBoardDimensions();
    $(window).resize(this.updateBoardDimensions);
  },

  componentWillUnmount: function() {
    $(document.body).off('keydown', this.recordKeypress);
  },

  updateBoardDimensions: function(event) {
    this.setState({
      boardHeight: $(window).height(),
      boardWidth: $(window).width()
    });
  },

  updateTimeElapsed: function() {
    var timeElapsed = new Date() - this.state.startTime;
    // update the score if we need to... we get 5 points every five seconds
    var updateBubbleFunc = this.updateBubblePos;
    // update the position of the bubbles
    this.setState({timeElapsed: timeElapsed,
                   bubbles: _.map(this.state.bubbles, function(bubble) {
                     return updateBubbleFunc(bubble, timeElapsed);
                   })});
  },

  updateScore: function() {
    var oldScore = this.state.score;
    var newScore = Math.floor(this.state.timeElapsed / 1000 / 5) * 25;
    if (oldScore < newScore) {
      this.setState({score: newScore });
    }
  },

  getInitialState: function() {
    return {
      bubbles: [],
      bubbleIdx: 0,
      boardHeight: $(window).height(),
      boardWidth: $(window).width(),
      isRunning: false,
      spaceshipX: $(window).width() / 2,
      spaceshipY: $(window).height() / 2,
      spaceshipTheta: 0,
      kbd: "",
      maxBubbles: 8,
      score: 0,
      showInstructions: true,
      startTime: new Date(),
      timeElapsed: 0
    }
  },

  getDefaultProps: function() {
    return {
      colors: ["#3F7DB4", "#3A53BF", "#FBCD4D", "#F6AB37"]
    }
  },

  beginGame: function() {
    var interval = 5;
    this.setState({
      isRunning: true,
      showInstructions: false
    });
    setInterval(this.mainEventLoop, interval);
    setInterval(this.addNewBubble, 600);
    $(document.body).on('keydown', this.recordKeypress);
  },

  recordKeypress: function(event) {
    var spacebarKeyCode = 32;
    var leftKeyCode = 37;
    var rightKeyCode = 39;
    var upKeyCode = 38;
    var downKeyCode = 40;
    var pauseKeyCode = 80;
    if (event.keyCode === spacebarKeyCode) {
      this.fire();
      return;
    }
    if (event.keyCode === leftKeyCode) {
      this.rotateLeft();
      event.preventDefault();
      return;
    }
    if (event.keyCode === rightKeyCode) {
      this.rotateRight();
      event.preventDefault();
      return;
    }
    if (event.keyCode === upKeyCode) {
      var theta = this.state.spaceshipTheta / 180 * Math.PI;
      if (Math.sin(theta) > 0) {
        this.rotateLeft();
      } else {
        this.rotateRight();
      }
      event.preventDefault();
      return;
    }
    if (event.keyCode === downKeyCode) {
      var theta = this.state.spaceshipTheta / 180 * Math.PI;
      if (Math.sin(theta) > 0) {
        this.rotateRight();
      } else {
        this.rotateLeft();
      }
      event.preventDefault();
      return;
    }
    if (event.keyCode === pauseKeyCode) {
      this.setState({isRunning: !this.state.isRunning});
      return;
    }
  },

  fire: function() {
    this.setState({isFiring: !this.state.isFiring});
    event.preventDefault();
  },

  rotateLeft: function() {
    var incrementFactor = 20;
    this.setState({spaceshipTheta: this.state.spaceshipTheta - 1 * incrementFactor});
  },

  rotateRight: function() {
    var incrementFactor = 20;
    this.setState({spaceshipTheta: this.state.spaceshipTheta + 1 * incrementFactor});
  },

  moveLeft: function() {
    var incrementFactor = 20;
    this.setState({spaceshipX: this.state.spaceshipX - 1 * incrementFactor});
  },

  moveRight: function() {
    var incrementFactor = 20;
    this.setState({spaceshipX: this.state.spaceshipX + 1 * incrementFactor});
  },

  moveUp: function() {
    var incrementFactor = 20;
    this.setState({spaceshipY: this.state.spaceshipY - 1 * incrementFactor});
  },

  moveDown: function() {
    var incrementFactor = 20;
    this.setState({spaceshipY: this.state.spaceshipY + 1 * incrementFactor});
  },

  render: function() {
    return (
      <div>
        { this.state.showInstructions ? <Instructions next={this.beginGame} /> : null }
        <Scoreboard passedStyle={styles.scoreboard} timeElapsed={this.state.timeElapsed} score={this.state.score} />
        { _.map(this.state.bubbles, function(data) {
          return ( <Bubble x={data.x} y={data.y} radius={data.radius} color={data.color} /> );
         })
         }
        { this.state.isRunning ?
        <Spaceship x={this.state.spaceshipX} y={this.state.spaceshipY} theta={this.state.spaceshipTheta} /> :
        null }
      </div>
    );
  }
});

module.exports = Invaders;
