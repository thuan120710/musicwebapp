import React, { useEffect,useState } from "react";
import "../styles/MainContainer.css";

import { FaUsers } from "react-icons/fa";
import { AudioList } from "./AudioList";
import { Banner } from "./Banner";
import { Songs } from "./Songs";
import { BiSearchAlt } from "react-icons/bi";
import Item from "./Item";
import {FaArrowCircleUp} from 'react-icons/fa';


import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa';

function MainContainer() {
  useEffect(() => {
    const allLi = document.querySelector(".menuList").querySelectorAll("li");

    function changePopularActive() {
      allLi.forEach((n) => n.classList.remove("active"));
      this.classList.add("active");
    }

    allLi.forEach((n) => n.addEventListener("click", changePopularActive));
  }, []);

  const allCategories = [ ...new Set(Songs.map((item) => item.category))];
  
  const [items, setItem] = useState(Songs);

  const [menuItems, setmenuItems] = useState(allCategories);

  const [copydata, setCopyData] = useState([]);
  const [current, setCurrent] = useState(0);
  const length = items.length;

  useEffect(() => {

    setTimeout(() => {
        setCopyData(Songs);
    }, 1000);

}, [])
  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(items) || items.length <= 0) {
    return null;
  }


  const filterItem = (category) => {
    if (category === '') {
      setItem(Songs);
      return;
    }
    const newItems = Songs.filter((item) => item.category === category);
    setItem(newItems);
  };
  const handleFilterCategory = (category) => {
    const filteredData = Songs.filter((item) => {
      if (item.category === category) {
        return item;
      }
    })
    ;

    setCopyData(filteredData);
  };
  const handleInput = (field) => (event) => {
    const { value } = event.target;

    switch (field) {
  
        case "categoryZ":
            handleFilterCategory(value);
          break;
     
     
      default:
        break;
    }
  };

  const chanegData = (e) => {
    let getchangedata = e.toLowerCase();

    if (getchangedata == "") {
        setCopyData(items);
    } else {
        let storedata = items.filter((j, k) => {
            return j.songName.toLowerCase().match(getchangedata);
        });

        setCopyData(storedata)
    }
}
const pathname = window.location.pathname;

const url="/";

  return (
    
    <div className="mainContainer">
      
      <Banner />

      <div className="menuList">
        <ul>
          <li>
           
          {menuItems.map((category) => (
            <button className="filter-btn" 
            
            onClick={handleInput("categoryZ")}
            value={category} key={category}
            
              >
              {category}
              
            </button>
          ))}
         
          </li>
        </ul>
      
        <p>
         
          <div className="searchBox">
           <input type="text"  placeholder="Search..." onChange={(e) => chanegData(e.target.value)}/>
        <i>
          <BiSearchAlt />
        </i>
        </div>
       
        </p>
      </div>
      <br></br> <br></br> <br></br>
        <section className='slider'>
      <FaArrowAltCircleLeft className='left-arrow' onClick={prevSlide} />
      <FaArrowAltCircleRight className='right-arrow' onClick={nextSlide} />
      {items.map((slide, index) => {
        return (
          <div
            className={index === current ? 'slide active' : 'slide'}
            key={index}
          >
            {index === current && (
              <img src={slide.imgSrc} alt='travel image' className='image' />
            )}
          </div>
        );
      })}
    </section>
      <br></br>
      {/* <Buttons   filterItem={filterItem}
            setItem={setItem} 
            menuItems={menuItems}
            /> */}
 <br></br>
 <br></br>

      <AudioList  
     item={copydata}
     
            />
    </div>
  );
}

export { MainContainer };
