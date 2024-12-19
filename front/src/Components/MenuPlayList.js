import React from "react";
import "../styles/LeftMenu.css";
import { FaPlus } from "react-icons/fa";
import { BsMusicNoteList } from "react-icons/bs";
import { PlayList } from "./PlayList";
import { Link } from "react-router-dom";

function MenuPlayList() {
  return (
    <div className="playListContainer">
      <div className="nameContainer">
        <div className="nameContainer-title d-flex hover-btn">
          <i className="me-3">
            <BsMusicNoteList />
          </i>
          <p className="mb-0">Your Library</p>
        </div>
        <i className="nameContainer-icon fa-solid fa-plus hover-btn"></i>
      </div>

      <div className="playListScroll">
        <div className="playListScroll-title text-white">
          Tạo danh sách phát đầu tiên!
        </div>
        <div className="playListScroll-description text-white">
          Rất dễ! chúng tôi sẽ giúp bạn
        </div>
        <Link to="/playlists" className="playListScroll-btn hover-btn">
          Tạo danh sách phát
        </Link>
      </div>
    </div>
  );
}

export { MenuPlayList };
