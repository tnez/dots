"use strict";

var React = require('react');

var style = {
  wrapper: {
    height: "100%",
    width: "100%"
  },
  instructionBox: {
    margin: "auto auto",
    marginTop: "4em",
    maxWidth: "600px",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: "1em",
    padding: "2em",
    color: "#666",
    fontSize: "1.6em",
    fontWeight: 200,
    textAlign: "left"
  },
  buttonBox: {
    marginTop: "1.4em",
    textAlign: "center"
  },
  button: {
    fontSize: "1.4em",
    fontWeight: "100",
    letterSpacing: "0.1em"
  }
};

var Instructions = React.createClass({
  getDefaultProps: function(){
    next: null
  },
  render: function(){
    return (
      <div style={style.wrapper}>
        <div style={style.instructionBox}>
          <h3>What is D.O.T.S?</h3>
          <p>It is a simple game implemented in <a href="http://facebook.github.io/react/" target="_blank">React</a> that I created in order to familiarize myself with <a href="http://facebook.github.io/react/" target="_blank">React</a> as well as test it's perfomance boundaries by <strong>abusing</strong> it's rendering loop.</p>
          <h3>How do I play?</h3>
          <ul>
            <li>Use the <strong>spacebar</strong> to start and stop the spaceship</li>
            <li>Use the <strong>arrow-keys</strong> to steer the spaceship</li>
            <li>Stay alive as long as you can by avoiding the floating dots</li>
            <li>It's harder than it looks!</li>
          </ul>
          <div style={style.buttonBox}>
            <button style={style.button} type="button" className="btn btn-primary">Start</button>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Instructions;
