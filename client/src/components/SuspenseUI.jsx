import React, { Fragment } from "react";
import Matrix from "./MatrixCanvas";

/**
 * React Suspense fallback UI
 */
export const fallback = (
  <Fragment>
    <Matrix />
    <div className="loading-container">
      <div className="loading-fallback">
        <div />
        <div />
        <div />
      </div>
      <h2 style={{ color: "white" }}>Loading secure data...</h2>
    </div>
  </Fragment>
);
