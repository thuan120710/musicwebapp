import { BsFillHouseFill, BsJournalAlbum } from "react-icons/bs";
import { BiPulse, BiSearchAlt } from "react-icons/bi";

import { FaBroadcastTower, FaMicrophoneAlt, FaPodcast } from "react-icons/fa";

const MenuList = [
  {
    id: 1,
    icon: <BsFillHouseFill />,
    name: "Trang Chủ",
    path: "/",
  },

  {
    id: 2,
    icon: <BiSearchAlt />,
    name: "Tìm Kiếm",
    path: "/search",
  },
  {
    id: 3,
    icon: <FaMicrophoneAlt />,
    name: "Nghệ sĩ",
    path: "/artist",
  },
  {
    id: 4,
    icon: <BsJournalAlbum />,
    name: "Albums",
    path: "/albums",
  },

  {
    id: 5,
    icon: <BsJournalAlbum />,
    name: "Playlist",
    path: "/playlists",
  },

  {
    id: 6,
    icon: <BsJournalAlbum />,
    name: "History",
    path: "/listening-history",
  },
];

export { MenuList };
