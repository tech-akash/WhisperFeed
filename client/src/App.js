import React from "react";
import {BrowserRouter as Router,Routes ,Route,Navigate} from "react-router-dom"
import Home from "./Pages/home";
import Signin from "./Pages/sigin";
import SignUp from "./Pages/signup";
import LogOut from "./Pages/logout";
// TweetDetail
import {useState,useEffect,createContext } from "react";
import Detail from "./Pages/detail";
import Profile from "./components/profile";
import Discover from "./components/discover";
// import Tags
import TagsTweetView from "./Pages/TagsTweet";

// import { LoginContext } from "./contexts/AuthContext";

function App() {
  
  const [isAuthenticated,setisAuthenticated]=useState()
  const [user,setUser]=useState("")
  
  
  return(
     <Router>
    <Routes>
  
      <Route path="/" element={<Home/>} />
      <Route path="/signin" element={user?<Navigate to='/'/>:<Signin/>} />
      <Route path="/signup" element={user?<Navigate to='/'/>:<SignUp/>} />
      <Route path="/logout" element={<LogOut/>} />
      <Route path="/discover" element={<Discover/>}/>
      <Route exact path="/detail/:id" element={<Detail/>} />
      <Route exact path="/profile/:id" element={<Profile/>} />
      <Route exact path="/hashtag/:nameoftag" element={<TagsTweetView/>} />
    </Routes>
    </Router> 
     
  );
}

export default App;
