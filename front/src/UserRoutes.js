import React, { useState, Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { LeftMenu } from "./Components/LeftMenu";
import Topbar from "./Admin/component/scenes/global/Topbar";
import MainContainer from "./Components/MainContainer";
import Search from "./Components/Search";
import Artist from "./Components/Artist";
import AudioPlayer from "./Components/Albums";
import Liked from "./Components/Liked";
import { Songs } from "./Components/Songs";
import Library from "./design/Library";
// import { PlayList } from "./Components/PlayList";
import Playlists from "./Components/PlaylistPage";
import Login from "./Admin/component/Login/Login"; // Import LoginForm
import { getAdminProfile } from "./Admin/actions/AuthAdminAction";
import { connect } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./Admin/component/theme";
// import { PlayList } from "./Components/PlayList";

export const handleLogin = (setLoggedIn) => {
  setLoggedIn(true);
};

export const handleLogout = (setIsLoggedIn) => {
  setIsLoggedIn(false);
};
function UserRoutes(props) {
  useEffect(() => {
    // Fetch admin profile when the component mounts
    props.getAdminProfile();
  }, []);

  const [theme, colorMode] = useMode();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebar, setIsSidebar] = useState(true);

  // Conditionally render login if not authenticated
  if (!props.authAdmin.token || props.authAdmin.token === undefined) {
    return <Login />;
  }

  // Nếu đã đăng nhập, hiển thị ứng dụng chính
  return (
    <div className="App">
      <Fragment>
        {/* <CssBaseline /> */}
        <Router>
          <LeftMenu> </LeftMenu>
          <main className="contents">
            {/* <Topbar setIsSidebar={setIsSidebar} setIsLoggedIn={setIsLoggedIn} /> */}

            <Switch>
              <Route exact path="/">
                <MainContainer />
              </Route>
              {/* <Route path="/playlist">
                <PlayList />
              </Route> */}

              <Route path="/search">
                <Search />
              </Route>
              <Route path="/playlists">
                <Playlists />
              </Route>

              {/* <Route path="/playlist">
                <Playlists />
              </Route> */}
              <Route path="/library">
                <Library />
              </Route>
              <Route path="/artist">
                <Artist />
              </Route>

              <Route path="/albums">
                <AudioPlayer tracks={Songs} />
              </Route>
              <Route path="/liked">
                <Liked />
              </Route>
            </Switch>
          </main>
        </Router>
      </Fragment>

      <div className="background"></div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    authAdmin: state.authAdmin,
  };
};

export default connect(mapStateToProps, { getAdminProfile })(UserRoutes);
