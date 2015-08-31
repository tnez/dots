"use strict";

var React = require('react');
var StyleSheet = require('react-style');

var styles = StyleSheet.create({
  table: {
    tableLayout: "fixed",
    fontSize: "2em",
    opacity: "0.9"
  },
  row: {
  },
  cell: {
  },
  labelCell: {
    fontWeight: "700px",
    width: "4em",
  },
  valueCell: {
    fontWeight: "300px",
    textAlign: "right"
  }
});

var Scoreboard = React.createClass({

  getDefaultProps: function() {
    return {
      passedStyle: {},
      timeElapsed: 0,
      score: 0
    };
  },

  render: function() {
    var mins = String(Math.floor(this.props.timeElapsed / 1000 / 60));
    var secs = (this.props.timeElapsed / 1000) % 60 < 10 ?
               String("0" + Math.floor((this.props.timeElapsed / 1000) % 60)) :
               String(Math.floor((this.props.timeElapsed / 1000) % 60));
    return (
      <div style={this.props.passedStyle}>
        <table style={styles.table}>
          <tr style={styles.row}>
            <td styles={[styles.cell, styles.labelCell]}>Time:</td>
            <td styles={[styles.cell, styles.valueCell]}>{mins}:{secs}</td>
          </tr>
          <tr style={styles.row}>
            <td styles={[styles.cell, styles.labelCell]}>Score:</td>
            <td styles={[styles.cell, styles.valueCell]}>{this.props.score}</td>
          </tr>
        </table>
      </div>
    );
  }
});

module.exports = Scoreboard;
