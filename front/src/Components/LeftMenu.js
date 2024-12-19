import React, { useEffect } from "react";
import "../styles/LeftMenu.css";
import { FaSpotify, FaEllipsisH } from "react-icons/fa";
import { BiSearchAlt } from "react-icons/bi";
import { MenuList } from "./MenuList";
import { MenuPlayList } from "./MenuPlayList";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

function LeftMenu() {
  useEffect(() => {
    const allLi = document
      .querySelector(".menuContainer ul")
      .querySelectorAll("li");

    function changeMenuActive() {
      allLi.forEach((n) => n.classList.remove("active"));
      this.classList.add("active");
    }

    allLi.forEach((n) => n.addEventListener("click", changeMenuActive));
  }, []);

  return (
    <div className="leftMenu">
      <div className="logoContainer">
        <div className="logo">
          <img
            src="./assets/img/logo_navbar.png"
            alt=""
            className="header__logo-img--spotify"
            style={{ width: "60%" }}
          />
        </div>
      </div>

      <div className="menuContainer">
        <ul>
          {MenuList.map((li) => (
            <li key={li.id}>
              <Link to={li.path}>
                <i>{li.icon}</i>
                <span> {li.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <MenuPlayList />
    </div>
  );
}

export { LeftMenu };
