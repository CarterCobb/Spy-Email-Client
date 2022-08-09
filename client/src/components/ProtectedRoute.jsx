import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { fallback as loading } from "./SuspenseUI";
import { ls } from "../api/general";

/**
 * Protects routes from global use.
 * @param {Object} `Object gets descructed~
 */
const ProtectedRoute = ({ element: Component, ...rest }) => {
  const [isAuthenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      const creds = JSON.stringify(ls.get("@creds") || "");
      if (creds.username && creds.password) setAuthenticated(true);
      else setAuthenticated(false)
    }
    return () => (mounted = false);
  }, []);

  if (isAuthenticated === null) return loading;

  if (isAuthenticated) return <Component {...rest} />;
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
