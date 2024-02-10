
import "./App.css";
import React, { useEffect,useState } from "react";
import { LeftMenu } from "./Components/LeftMenu";

import { MainContainer } from "./Components/MainContainer";
import { RightMenu } from "./Components/RightMenu";
import { Fragment } from 'react';
import ScrollButton from "./Components/ScrollButton";
import BottomButton from "./Components/BottomButton";
import Search from "./Components/Search";
import Artist from "./Components/Artist";
import AudioPlayer from "./Components/Albums";
import { Songs } from "./Components/Songs";
import { BrowserRouter as Router, Route, Switch,Link} from 'react-router-dom'
function App() {
 
  const pathname = window.location.pathname;

const url="/";
  return (
    <div className="App">
      <div className=""></div>
      <Fragment>
      <Router>
      <LeftMenu></LeftMenu>
    

      <Switch>
     <Route exact path="/">
     <MainContainer /> 
     </Route>
     <Route path="/search">
     <Search />
     </Route>
     <Route path="/artist">
         <  Artist/>
     </Route>
     <Route path="/albums">
     <AudioPlayer tracks={Songs} />
     </Route>
 </Switch>
  
  </Router>
      </Fragment>
    



      <div className="background"></div>
    </div>
  );
}

export default App;
