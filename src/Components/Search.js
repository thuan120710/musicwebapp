import React, { useEffect,useState } from "react";
import PropTypes from 'prop-types';

import { Songs } from "./Songs";
import {
  FaRegHeart,

} from "react-icons/fa";
import "../styles/artist.css";
import MusicPlayer from "./Musics";
import Navbar from "./Navbar";


import Cart from "./Cart";
export default function Search(){
   const [show, setShow] = useState(true);
  const [fav, setfav] = useState([]);

  const handleClick = (item) => {
    if (fav.indexOf(item) !== -1) return;
    setfav([...fav, item]);
  };

  const handleChange = (item, d) => {
    const ind = fav.indexOf(item);
    const arr = fav;
    arr[ind].amount += d;

    if (arr[ind].amount === 0) arr[ind].amount = 1;
    setfav([...arr]);
  };
  const [isLove, setLove] = useState(false);
    const alltype= [ ...new Set(Songs.map((item) => item.type))];
  
    const [items, setItem] = useState(Songs);
    const [song, setSong] = useState(items[0].song);
    const [img, setImage] = useState(items[0].imgSrc);
    const [id, setId] = useState(items[0].id);
    const [auto, setAuto] = useState(false);
    const [copydata, setCopyData] = useState([]);


  
    useEffect(() => {

      setTimeout(() => {
          setCopyData(Songs);
      }, 1000);
  
  }, [])
    
    
    const setMainSong = (songSrc, imgSrc,id) => {
      setSong(songSrc);
      setImage(imgSrc);
      setId(id);
      setAuto(true);
      
    };
  
    const chanegData = (e) => {
      let getchangedata = e.toLowerCase();
      if (getchangedata == "") {
        setCopyData(items);
      } else {
          let storedata = items.filter((ele, k) => {
              return ele.songName.toLowerCase().match(getchangedata);
          });
          setCopyData(storedata);
          
      }
  }





                    // return items.map((song, i) => {
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
           
                </div>
            </div>
        </div>
        <Navbar setShow={setShow} size={fav.length} />     
        {show ? (
                    <p></p>
                  ) : (
                    <Cart cart={fav} setCart={setfav} handleChange={handleChange} />
                  )}
          <ul class="browse-view-container">
             
                          
               
                {
       copydata.map((song, i) => (
        
                <div class="category-image">
                
       
                <li class="category-item">
                          <ol
                          onClick={() => setMainSong(song?.song, song?.imgSrc,song?.id)}
                            className=""
                            key={song.id}
                          >                         

               
                    <button className="loved" onClick={() => handleClick(song)}>  <i>
                  <FaRegHeart />
                </i>*Fav</button><br></br>
                    
                                <img alt="album" variant="top" class="picz" src={song.imgSrc} />
                          
                                          
               
                
                                <div className="play-song">
                                  <i
                                    className="fa fa-play-circle-o play-btn"
                                    aria-hidden="true"
                                  />
                                </div>
                          
                
                              <div className="album-details">
     
                                <p className="album-name">{song.songName}</p>
                                <p className="artist-name">{song.artist}</p>
                   
                                <br></br>
                              </div>
                                </ol>
                 
                          </li>
                              </div>
                                       )
                                       )
                                     
                       }
                         
                          </ul>
               <br></br>
                          <div className="footer">
                       <MusicPlayer song={song} imgSrc={img} autoplay={auto} id={id} />  
                            </div>
                      
                             </div>
                             </div>
                        );
                        
   
                       
}
