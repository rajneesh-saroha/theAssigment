import React, { useEffect } from "react";
import "./App.css";
import Dashboard from "./Dashboard";
import AdminLogin from "./AdminLogin";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route
            exact
            path="/adminLogin"
            render={() => {
              return sessionStorage.getItem("accessToken") ? (
                <Redirect to="/" />
              ) : (
                <AdminLogin />
              );
            }}
          />
          <Route
            path="/"
            render={() => {
              return sessionStorage.getItem("accessToken") ? (
                <Dashboard />
              ) : (
                <Redirect to="/adminLogin" />
              );
            }}
          />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
