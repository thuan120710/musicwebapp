// App.js

import "./App.css";
import React, { Profiler } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AdminRoutes from "./AdminRoutes";
import UserRoutes from "./UserRoutes";
import Register from "./Admin/component/Login/Register"; // Import the Register component

// import PlaylistSection from "./Components/PlaylistSection"; // Import the PlaylistSection component
import { Provider } from "react-redux";
import store from "./store"; // Import your Redux store
import Library from "./design/Library";

function App() {
  return (
    <div className="">
      <Router>
        <Provider store={store}>
          {/* Wrap your entire application with the Provider */}
          <Switch>
            <Route exact path="/">
              <UserRoutes />
            </Route>

            <Route path="/admin">
              <AdminRoutes />
            </Route>

            <Route path="/lybary">
              <Library />
            </Route>

            <Route path="/registration">
              <Register />
            </Route>

            <Route path="/profile">
              <Profiler />
            </Route>

            <Route path="/playlists">{/* <PlaylistSection /> */}</Route>
          </Switch>
        </Provider>
      </Router>
      <div className="background"></div>
    </div>
  );
}

export default App;
