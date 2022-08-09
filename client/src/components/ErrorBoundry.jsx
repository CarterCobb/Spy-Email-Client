import React, { Component } from "react";
import { Fragment } from "react";

/**
 * React Error boundary to catch UI erorrs during runtime.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  /**
   * Sets the state of the component to an error
   * @param {Object} error
   */
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  /**
   * Gets detailed information on the error
   * @param {Object} error
   * @param {Object} errorInfo
   */
  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    const { error, errorInfo, hasError } = this.state;
    if (hasError) {
      return (
        <Fragment>
          <h1>Something went wrong.&nbsp;&nbsp;:(</h1>
          <p>
            The following error occured:
            <br />
          </p>
          <p>
            <b>Error:</b>{" "}
            {error ? error.message ?? "No Error Message" : "Unknown Error"}
          </p>
          <p style={{ whiteSpace: "pre-wrap" }}>
            <b>Trace:</b>
            <br />
            {errorInfo ? errorInfo.componentStack : "None"}
          </p>
        </Fragment>
      );
    }
    return this.props.children;
  }
}
