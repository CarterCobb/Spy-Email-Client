import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Code Spliting
import ErrorBoundary from "./components/ErrorBoundry";
import { fallback } from "./components/SuspenseUI";

// Middleware
import ProtectedRoute from "./components/ProtectedRoute";

// General Pages
const Home = lazy(() => import("./pages/Home"));
const Email = lazy(() => import("./pages/Email"));

// Error Pages
const NotFound = lazy(() => import("./components/NotFound"));

const App = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={fallback}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<ProtectedRoute element={Email} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
