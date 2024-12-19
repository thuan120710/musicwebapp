import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Dashboard from "./Admin/component/scenes/dashboard";
import Topbar from "./Admin/component/scenes/global/Topbar";
import Sidebars from "./Admin/component/scenes/global/Sidebars";
import Team from "./Admin/component/scenes/team";
import Invoices from "./Admin/component/scenes/invoices";
import Contacts from "./Admin/component/scenes/contacts";
import Bar from "./Admin/component/scenes/bar";
import Form from "./Admin/component/scenes/form";
import SongsEdit from "./Admin/component/scenes/invoices/songs_edit";
import Line from "./Admin/component/scenes/line";
import Pie from "./Admin/component/scenes/pie";
import FAQ from "./Admin/component/scenes/faq";
import Geography from "./Admin/component/scenes/geography";
import Calendar from "./Admin/component/scenes/calendar/calendar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./Admin/component/theme";
import Login from "./Admin/component/Login/Login";
import Register from "./Admin/component/Login/Register";
import { connect } from "react-redux";
import { getAdminProfile } from "./Admin/actions/AuthAdminAction";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import UserList from "./Admin/component/userlist/UserList";
import UserForm from "./Admin/component/userlist/UserForm";

function AdminRoutes(props) {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  const history = useHistory(); // Sử dụng useHistory để chuyển hướng sau khi đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null); // Vai trò của người dùng

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      setIsLoggedIn(true);
      setRole(user.role); // Lấy vai trò từ thông tin user
      props.getAdminProfile(); // Fetch thông tin admin
    } else {
      setIsLoggedIn(false);
      setRole(null);
    }
  }, [props]);

  // Nếu chưa đăng nhập, hiển thị form đăng nhập
  if (!isLoggedIn) {
    return <Login onLoginSuccess={() => setIsLoggedIn(true)} />; // Chuyển sang trạng thái đã đăng nhập sau khi thành công
  }

  // Nếu người dùng không phải admin, điều hướng tới trang khác
  if (role !== "admin") {
    return <Redirect to="/" />; // Hoặc điều hướng tới trang không đủ quyền
  }

  // Nếu đã đăng nhập và là admin, render giao diện admin
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Router>
          <Sidebars isSidebar={isSidebar} />
          <main className="contents">
            <Topbar setIsSidebar={setIsSidebar} />

            <Switch>
              {/* Định nghĩa route cho trang login */}
              <Route path="/login" component={Login} exact />
              <Route path="/admin" component={Dashboard} exact />
              <Route path="/registration" component={Register} exact />
              <Route path="/team" component={Team} exact />
              <Route path="/contacts" component={Contacts} exact />
              <Route path="/invoices" component={Invoices} exact />
              <Route path="/form" component={Form} exact />
              <Route path="/songs_edit/:id" component={SongsEdit} exact />
              <Route path="/bar" component={Bar} exact />
              <Route path="/pie" component={Pie} exact />
              <Route path="/line" component={Line} exact />
              <Route path="/faq" component={FAQ} exact />
              <Route path="/calendar" component={Calendar} exact />
              <Route path="/geography" component={Geography} exact />
              <Route path="/admin/users" component={UserList} />
              <Route path="/admin/add-user" component={UserForm} />
              <Route path="/admin/edit-user/:userId" component={UserForm} />

              {/* Redirect mặc định về dashboard nếu user đã đăng nhập */}
              <Redirect from="*" to="/admin" />
            </Switch>
          </main>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

const mapStateToProps = (state) => {
  return {
    authAdmin: state.authAdmin, // Lấy thông tin xác thực từ Redux store
  };
};

export default connect(mapStateToProps, { getAdminProfile })(AdminRoutes);
