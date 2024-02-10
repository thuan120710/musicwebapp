import React, { useEffect,useState } from "react";

import { artist } from "./Songs";
import { Lists } from "./Songs";
import { GENERS } from "./Songs";
import { NEWRELEASES} from "./Songs";  
import {FEATURED} from "./Songs"; 
import "../styles/artist.css";

function Artist() {
    const [copydata, setCopyData] = useState([]);

    const [items, setItem] = useState(Lists);

    const [art, setartist] = useState( artist);

    useEffect(() => {

        setTimeout(() => {
            setCopyData(FEATURED);
        }, 1000);
    
    }, []);

    const chanegData = (e) => {
        let getchangedata = e.toLowerCase();
        if (getchangedata === "") {
          setCopyData(items);
        } else {
            let storedata = items.filter((ele, k) => {
                return ele.type.toLowerCase().match(getchangedata);
            });
            setCopyData(storedata);
            
        }
    }
    const handleFilterartist = (category) => {
        const filteredData =  Lists.filter((item) => {
          if (item.type === category) {
            return item;
          }
        });
    
        setCopyData(filteredData);
      };
    const handleInput = (field) => (event) => {
        const { value } = event.target;
  
        switch (field) {
      
            case "artist":
                handleFilterartist(value);
              break;
         
         
          default:
            break;
        }
      };
  return (
  
<div class="main-section">
    <div class="header">
        <div class="track-search-container">
            <form>
            <input type="text" placeholder="Search..." onChange={(e) => chanegData(e.target.value)}/>
                <button><i class="fa fa-search search" aria-hidden="true"></i></button></form>
            </div>
            <div class="user-details-container"><img alt="user" class="user-image" src=""/><p class="user-name">Mathew</p>
            </div>
        </div>
        <div class="main-section-container">
            <div class="section-title"><div>
                <h3 class="header-title">Browse</h3>
                <div class="browse-headers">
                {art.map((slide, index) => {
                     return (
                     
                        <button className="filter-btns" 
            
                        onClick={handleInput("artist")}
                        value={slide.name} key={slide.name}
                        
                          >
                       {slide.name}
                          
                        </button>
                  );
                })}
               
                </div>
            </div>
        </div>
      
        <ul class="browse-view-container">
        {
        copydata.map((song, i) => {
            return (
          <li class="category-item">
        
          <div class="category-image">
              <img alt="category" src={song.imgSrc}/><p class="category-name">Top Lists</p>
          </div>
          
         </li>
            );
        })}
              </ul>
                   
                </div></div>

  )
}

export default Artist
