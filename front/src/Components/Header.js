import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import "../styles/search.css";

import { RxCaretLeft, RxCaretRight } from "react-icons/rx";

export default function Header() {
  const history = useHistory();

  // Xử lý logout
  const handleLogout = () => {
    // Xóa token và thông tin user khỏi localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Chuyển hướng người dùng về trang login
    history.push("/login");
  };

  const handleButtonClick = () => {
    // Push a new entry onto the history stack
    history.push("/liked");
  };

  return (
    <div className="Header">
      <div className="bg-gradient-to-b from-emerald-800 p-6">
        <div className="w-full mb-4 flex items-center justify-between">
          <div className="flex gap-x-2 items-center">
            <button className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition">
              <RxCaretLeft size={35} className="text-white" />
            </button>
            <button className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition">
              <RxCaretRight size={35} className="text-white" />
            </button>
          </div>

          {/* Thêm nút Logout */}
          <div className="flex gap-x-4 items-center">
            <button
              onClick={handleLogout}
              type="button"
              className="rounded-full bg-red-500 px-4 py-2 text-white font-bold hover:opacity-75 transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">
          <button className="relative group flex items-center rounded-md overflow-hidden gap-x-4 bg-neutral-100/10 hover:bg-neutral-100/20 transition pr-4">
            <div className="relative min-h-[64px] min-w-[64px]">
              <img
                alt="Image"
                loading="lazy"
                decoding="async"
                data-nimg="fill"
                className="object-cover"
                sizes="100vw"
                src={`http://localhost:4000/uploads/liked.png`}
                style={{
                  position: "absolute",
                  height: "100%",
                  width: "100%",
                  inset: "0px",
                  color: "transparent",
                }}
              />
            </div>
            <p
              className="font-medium truncate py-5"
              onClick={handleButtonClick}
            >
              Liked Songs
            </p>
            <div className="absolute transition opacity-0 rounded-full flex items-center justify-center bg-green-500 p-4 drop-shadow-md right-5 group-hover:opacity-100 hover:scale-110">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 448 512"
                className="text-black"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
