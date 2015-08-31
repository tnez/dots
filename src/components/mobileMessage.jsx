"use strict";

var React = require('react');

var style = {
  mainBox: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: "url(/img/background.png)",
    backgroundSize: "auto 125%",
    backgroundPosition: "50% 50%"
  },
  messageBox: {
    margin: "auto auto",
    marginTop: "2em",
    maxWidth: "260px",
    padding: "2em",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: "1em",
    color: "#666",
    fontWeight: 100
  },
  linkBox: {
    marginTop: "2em"
  }
};

var MobileMessage = React.createClass({
  render: function(){
    return (
      <div style={style.mainBox}>
        <div style={style.messageBox}>
          <h3>We apologize...</h3>
          <p><strong>D.O.T.S</strong> does not function well on a mobile device. The screen is too small, processer too slow, and the lack of a physical keyboard prevent effective navigation of the spaceship. To play <strong>D.O.T.S.</strong> come back and visit us from the browser of your favorite computer!</p>
          <div style={style.linkBox}>
            <p className="text-center">
              <a href="http://tnesland.me">tnesland.me</a> | <a href="https://github.com/tnez/dots">github</a></p>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = MobileMessage;
