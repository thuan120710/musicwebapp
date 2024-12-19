import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebars = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `var(--black-color) !important`,
          margin: `0px 10px`
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
          display: "flex !important",
          width: "35px !important",
          justifyContent: "center !important",
          marginRight: "0px !important",
        },
        "& .pro-inner-item": {
          padding: "5px 0px 5px 14px !important",
        },
        "& .pro-inner-item:hover": {
          color: "var(--black-color) !important",
          backgroundColor: "var(--primary-color) !important"
        },
        "& .pro-inner-item:hover .pro-item-content p": {
          color: "var(--black-color) !important"
        },
        "& .pro-menu-item": {
          margin: "15px 0px",
        },
        "& .pro-menu-item.active": {
          color: "var(--black-color) !important",
          backgroundColor: "var(--primary-color) !important"
        },
        "& .pro-inner-item.active .pro-item-content p": {
          color: "var(--black-color) !important"
        },
        "& .pro-icon svg": {
          width: "3rem",
          height: "3rem"
        },
        "& .pro-item-content p": {
          fontSize: "1.6rem",
          marginLeft: "12px",
          marginTop: "3px",
          textAlign: "start",
          fontWeight: "600"
        },
        backgroundColor: "black !important"
      }}
    >
      <ProSidebar collapsed={isCollapsed}
        sx={{
          backgroundColor: "black !important"
        }}
      >
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem onClick={() => setIsCollapsed(!isCollapsed)} icon={isCollapsed ? <MenuOutlinedIcon /> : undefined} style={{ margin: "10px 0px 20px 0", color: colors.grey[100] }}>
            {!isCollapsed && (
              <Box display="flex" justifyContent="start" alignItems="center" ml="15px">
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <i className="fa-solid fa-arrow-left fs-3 custom-arrow-icon me-4"></i>
                  <span className="fs-3 fw-bold">Thu gọn</span>
                </IconButton>
              </Box>
            )}
          </MenuItem>
          
          {/* Profile = avatar + name + role */}
          {!isCollapsed && (
            <Box mb="50px" sx={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              {/* Image Avatar */}
              <Box sx={{ borderRadius: "50%", width: "100px", height: "100px", border: "2px solid var(--primary-color)" }}>
                <img alt="profile-user" width="100%" height="100%" src={`../../assets/user.png`} />
              </Box>

              <Box sx={{ marginTop: "15px" }}>
                {/* Name */}
                <Typography variant="h3" sx={{ color: "var(--primary-color)", fontWeight: "bold", textShadow: "2px 4px 3px rgba(0,0,0,0.3);" }}>Lê Duy Thuận</Typography>

                {/* Role */}
                <Typography variant="h5" sx={{ color: "var(--white-color)", paddingTop: "5px", fontWeight: "600" }}>Admin</Typography>

              </Box>
            </Box>
          )}

          <Box>
            <Item
              title="Bảng điều khiển"
              to="/dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>
            <Item
              title="Quản lý danh mục"
              to="/team"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Chỉnh sửa danh mục"
              to="/contacts"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}

            />
            <Item
              title="Chỉnh sửa bài hát"
              to="/invoices"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}

            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>
            <Item
              title="Tạo bài hát"
              to="/form"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}

            />
            <Item
              title="Lịch"
              to="/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Hỏi và đáp"
              to="/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />           
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebars;