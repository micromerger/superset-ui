import React, { Component } from 'react';

export default class SVGIconComponent extends Component {
  render() {
    const perc = this.props.perc || 0;
    return (
      <div style={{ top: '-15px', left: '-15px', position: 'absolute' }}>
        <svg
          width="50px"
          height="50px"
          viewBox="0 0 42 42"
          className="donut"
          aria-labelledby="beers-title beers-desc"
          role="img"
        >
          <circle
            className="donut-hole"
            cx="21"
            cy="21"
            r="15.91549430918954"
            fill="white"
            role="presentation"
          ></circle>
          <circle
            className="donut-ring"
            cx="21"
            cy="21"
            r="15.91549430918954"
            fill="transparent"
            stroke="#d2d3d4"
            strokeWidth="3"
            role="presentation"
          ></circle>
          <circle
            className="donut-segment"
            cx="21"
            cy="21"
            r="15.91549430918954"
            fill="transparent"
            stroke="#ce4b99"
            strokeWidth="3"
            strokeDasharray={`${perc} ${100 - perc}`}
            strokeDashoffset="25"
            aria-labelledby="donut-segment-1-title donut-segment-1-desc"
          ></circle>
          <g className="chart-text">
            <text className="chart-number" x="25%" y="60%">
              {perc == 0 ? '>1' : perc}%
            </text>
          </g>
        </svg>
      </div>
    );
  }
}
