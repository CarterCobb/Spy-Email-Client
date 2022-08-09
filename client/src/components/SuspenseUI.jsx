import React, { Fragment } from "react";
import Matrix from "./MatrixCanvas";

/**
 * React Suspense fallback UI
 */
export const fallback = (
  <Fragment>
    <Matrix />
    <div className="loading-caontainer">
      <div class="loading-fallback">
        <div />
        <div />
        <div />
      </div>
      <h2>Loading secure data...</h2>
    </div>
  </Fragment>
);
