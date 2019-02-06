import React, { Component } from "react";

/**
 * Page.js
 * Component rendering page of PDF
 **/

class Page extends Component {
  state = {
    status: "N/A",
    page: null,
    width: 0,
    height: 0
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.pdf !== nextProps.pdf || this.state.status !== nextState.status
    );
  }

  componentDidUpdate(nextProps) {
    this._update(nextProps.pdf);
  }

  componentDidMount() {
    const { pdf } = this.props;
    this._update(pdf);
  }

  setCanvasRef = canvas => {
    this.canvas = canvas;
  };

  getCanvasRef = () => {
    return this.canvas;
  };

  _update = pdf => {
    if (pdf) {
      this._loadPage(pdf);
    } else {
      this.setState({ status: "loading" });
    }
  };

  _loadPage(pdf) {
    if (this.state.status === "rendering" || this.state.page !== null) return;

    pdf.getPage(this.props.index).then(page => {
      this.setState({ status: "rendering" });
      this._renderPage(page);
    });
  }

  _renderPage(page) {
    let scale = 0.6;
    let viewport = page.getViewport(scale);

    let width = viewport.width;
    let height = viewport.height;
    let canvas = this.getCanvasRef();
    let context = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    const renderTask = page.render({
      canvasContext: context,
      viewport
    });

    const that = this;
    renderTask.promise.then(function() {
      that.setState({ status: "rendered", page, width, height });
    });
  }

  render() {
    let { width, height, status } = this.state;

    console.log(this.state);

    return (
      <div className={`pdf-page ${status}`} style={{ width, height }}>
        <canvas ref={this.setCanvasRef} />
        {this.state.status === "rendered" ? (
          <canvas ref={this.getCanvasRef} />
        ) : null}
      </div>
    );
  }
}

export { Page };
