// App.js

import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AdminRoutes from "./AdminRoutes";
import UserRoutes from "./UserRoutes";
import Register from "./Admin/component/Login/Register"; // Import the Register component
import { Provider } from "react-redux";
import store from "./store"; // Import your Redux store
import Library from "./design/Library";
import Artist from "./Components/Artist";
import Search from "./Components/Search";
import PlaylistPage from "./Components/PlaylistPage";
import PlaylistDetail from "./Components/PlaylistDetail";

import SongList from "./Components/SongList";
import FavoritesList from "./Components/FavoritesList";
import Login from "./Admin/component/Login/Login";
import MusicRecommendations from "./Components/MusicRecommendations";
function App() {
  return (
    <Provider store={store}>
      {" "}
      {/* Bọc toàn bộ ứng dụng trong Provider */}
      <Router>
        <div className="App">
          <Switch>
            {/* Định tuyến trang người dùng */}
            <Route exact path="/" component={UserRoutes} />

            {/* Định tuyến cho Admin */}
            <Route path="/admin" component={AdminRoutes} />

            {/* Định tuyến khác */}
            <Route path="/artist" component={Artist} />
            <Route path="/playlists" component={PlaylistPage} />

            <Route path="/playlist/:id/add-songs" component={SongList} />
            <Route path="/playlist/:id" component={PlaylistDetail} />
            <Route path="/favorites" component={FavoritesList} />
            <Route path="/search" component={Search} />
            <Route path="/library" component={Library} />
            <Route path="/musicrecomment" component={MusicRecommendations} />
            <Route path="/registration" component={Register} />
            <Route path="/login" component={Login} />

            {/* Định tuyến mặc định nếu không khớp route */}
            <Route path="*">
              <div>404 - Page Not Found</div>
            </Route>
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
