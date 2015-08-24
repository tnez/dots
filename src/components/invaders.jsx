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
      let speedBoost = 3;
      let theta = this.state.spaceshipTheta / 180 * Math.PI;
      let yVelo = -Math.cos(theta) * speedBoost;
      let xVelo = Math.sin(theta) * speedBoost;
      let newX = this.state.spaceshipX + xVelo * 0.5;
      let newY = this.state.spaceshipY + yVelo * 0.5 ;
      // TODO: remove hardcoded 60 and take into account spaceship width
      if (newX <= 0 || newX >= this.state.boardWidth - 60) {
        let newTheta = newX <= 0 ? 90 : -90;
        this.setState({spaceshipTheta: newTheta, isFiring: false});
        return;
      }
      if(newY <= 0 || newY >= this.state.boardHeight -  60) {
        let newTheta = newY <= 0 ? 180 : 0;
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
    let spaceshipX = this.state.spaceshipX;
    let spaceshipY = this.state.spaceshipY;
    let collisions = _.filter(this.state.bubbles, function(bubble) {
      let dist = Math.sqrt(Math.pow(bubble.x - spaceshipX, 2) +
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
    let interval = 5;
    this.updateBoardDimensions();
    $(window).resize(this.updateBoardDimensions);
    setInterval(this.mainEventLoop, interval);
    setInterval(this.addNewBubble, 600);
    $(document.body).on('keydown', this.recordKeypress);
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
    let timeElapsed = new Date() - this.state.startTime;
    // update the score if we need to... we get 5 points every five seconds
    var updateBubbleFunc = this.updateBubblePos;
    // update the position of the bubbles
    this.setState({timeElapsed: timeElapsed,
                   bubbles: _.map(this.state.bubbles, function(bubble) {
                     return updateBubbleFunc(bubble, timeElapsed);
                   })});
  },

  updateScore: function() {
    let oldScore = this.state.score;
    let newScore = Math.floor(this.state.timeElapsed / 1000 / 5) * 25;
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
      isRunning: true,
      spaceshipX: $(window).width() / 2,
      spaceshipY: $(window).height() / 2,
      spaceshipTheta: 0,
      kbd: "",
      maxBubbles: 8,
      score: 0,
      startTime: new Date(),
      timeElapsed: 0
    }
  },

  getDefaultProps: function() {
    return {
      colors: ["red", "orange", "green", "blue", "indigo", "violet"]
    }
  },

  recordKeypress: function(event) {
    let spacebarKeyCode = 32;
    let leftKeyCode = 37;
    let rightKeyCode = 39;
    let upKeyCode = 38;
    let downKeyCode = 40;
    let pauseKeyCode = 80;
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
      let theta = this.state.spaceshipTheta / 180 * Math.PI;
      if (Math.sin(theta) > 0) {
        this.rotateLeft();
      } else {
        this.rotateRight();
      }
      event.preventDefault();
      return;
    }
    if (event.keyCode === downKeyCode) {
      let theta = this.state.spaceshipTheta / 180 * Math.PI;
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
    let incrementFactor = 20;
    this.setState({spaceshipTheta: this.state.spaceshipTheta - 1 * incrementFactor});
  },

  rotateRight: function() {
    let incrementFactor = 20;
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
        <Scoreboard passedStyle={styles.scoreboard} timeElapsed={this.state.timeElapsed} score={this.state.score} />
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
