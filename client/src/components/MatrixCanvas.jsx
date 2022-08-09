import React, { Component } from "react";

export default class Matrix extends Component {
  static defaultProps = {
    colSize: 11,
    fontSize: 9,
    interval: 30,
    color: "#00cc33",
    frequency: 0.005,
    speed: 1.6,
  };

  constructor(props) {
    super(props);

    this.state = {
      canvas: null,
    };

    this.draw = this.draw.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentDidMount() {
    this.setState({ canvas: this.refs.canvas }, () => {
      let columns = [];
      let context = this.state.canvas.getContext("2d");
      let size = this.props.colSize;
      let source = "0 0 1 1";
      let width = window.innerWidth;
      let height = window.innerHeight;
      let canvas = this.state.canvas;
      canvas.width = width;
      canvas.height = height;

      let numberOfColumns = Math.floor((width / size) * 3);

      this.setState(
        { canvas, columns, context, size, source, numberOfColumns },
        () => {
          for (let i = 0; i < numberOfColumns; i++) {
            columns.push(0);
          }

          this.draw();
          let interval = setInterval(this.draw, 50 / this.props.speed);
          this.setState({ interval });
          window.addEventListener("resize", this.updateDimensions);
        }
      );
    });
  }

  draw() {
    let context = this.state.context;
    let columns = this.state.columns;
    let numberOfColumns = this.state.numberOfColumns;

    context.fillStyle = "rgba(0,0,0,0.05)";
    context.fillRect(0, 0, this.state.canvas.width, this.state.canvas.height);
    context.fillStyle = this.props.color;
    context.font =
      "700 " + this.props.fontSize + "px Consolas,monaco,monospace";

    for (let columnIndex = 0; columnIndex < numberOfColumns; columnIndex++) {
      let index = Math.floor(Math.random() * this.state.source.length);
      let character = this.state.source[index];
      let positionX = columnIndex * this.state.size;
      let positionY = columns[columnIndex] * this.state.size;

      context.fillText(character, positionX, positionY);
      if (
        positionY >= this.state.canvas.height &&
        Math.random() > 1 - this.props.frequency
      ) {
        columns[columnIndex] = 0;
      }
      columns[columnIndex]++;
    }

    this.setState({ context, columns });
  }

  updateDimensions() {
    let canvas = this.state.canvas;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  render() {
    let style = this.props.style ? this.props.style : {};
    return (
      <div
        style={{
          ...style,
          background: "#000000",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          zIndex: -1,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <canvas ref="canvas" />
      </div>
    );
  }
}
