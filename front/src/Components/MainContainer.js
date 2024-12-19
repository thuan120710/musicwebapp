import React, { useEffect, useState } from "react";
import "../styles/MainContainer.css";
import { Banner } from "./Banner";
import { AudioList } from "./AudioList";
import { BiSearchAlt } from "react-icons/bi";
import { fetchCategories } from "../Admin/actions/CategoryAction";
import { fetchSong } from "../Admin/actions/SongAction";
import { connect } from "react-redux";
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";
import Header from "./Header";
import { Link } from "react-router-dom";

function MainContainer(props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copydata, setCopyData] = useState([]);

  useEffect(() => {
    props.fetchCategories();
    props.fetchSong(); // Fetch both categories and songs
  }, []); // Empty dependency array to fetch data only once on component mount

  useEffect(() => {
    setCopyData(props.songs);
  }, [props.songs]);

  const handleCategoryClick = (category) => {
    let filteredData;
    if (category === "All") {
      filteredData = props.songs; // Display all songs when "All" is clicked
    } else {
      filteredData = props.songs.filter((item) => item.category === category);
    }
    setCopyData(filteredData);
  };

  const handleSearch = (e) => {
    let getchangedata = e.toLowerCase();
    if (getchangedata === "") {
      setCopyData(props.songs);
    } else {
      let storedata = props.songs.filter((j, k) =>
        j.songName.toLowerCase().match(getchangedata)
      );
      setCopyData(storedata);
    }
  };

  const nextSlide = () => {
    console.log("Next slide clicked");
    setCurrentSlide((prev) => (prev === props.songs.length - 1 ? 0 : prev + 1)); // Update current state
    console.log("Current slide:", currentSlide);
  };

  const prevSlide = () => {
    console.log("Previous slide clicked");
    setCurrentSlide((prev) => (prev === 0 ? props.songs.length - 1 : prev - 1)); // Update current state
    console.log("Current slide:", currentSlide);
  };

  return (
    <div className="mainContainer">
      <Header
        onSearch={handleSearch}
        onPrevSlide={prevSlide}
        onNextSlide={nextSlide}
      ></Header>

      <div
        style={{
          backgroundColor: "#121212",
          margin: "15px 8px 0 0",
          borderRadius: "10px",
        }}
      >
        <button className="relative group header__favorite-group hover-btn">
          <div className="relative header__favorite-image">
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
                borderRadius: "50%",
              }}
            />
          </div>
          <Link
            to="/favorites"
            className="header__favorite-title truncate ms-3"
          >
            Bài hát đã thích
          </Link>
        </button>
      </div>

      <div className="menuList">
        <ul>
          <li>
            <button
              className="filter-btn"
              onClick={() => handleCategoryClick("All")} // Handle click for "All" category
            >
              All
            </button>
          </li>
          {props.categories.map((category) => (
            <li key={category.id}>
              <button
                className="filter-btn"
                onClick={() => handleCategoryClick(category.name)}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <br />
      <br />
      <br />
      <section className="slider">
        <FaArrowAltCircleLeft className="left-arrow" onClick={prevSlide} />
        <FaArrowAltCircleRight className="right-arrow" onClick={nextSlide} />
        {props.songs.map((slide, index) => {
          return (
            <div
              className={index === currentSlide ? "slide active" : "slide"}
              key={index}
            >
              {index === currentSlide && (
                <img
                  src={`http://localhost:4000/${slide.imgSrc}`}
                  alt="travel image"
                  className="image"
                />
              )}
            </div>
          );
        })}
      </section>
      <br />
      <br />
      <br />
      {props.songs.length > 0 && <AudioList item={copydata} />}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    categories: state.CategoryAdmin.categories || [],
    songs: state.SongAdmin.songs || [],
  };
};

export default connect(mapStateToProps, { fetchCategories, fetchSong })(
  MainContainer
);
