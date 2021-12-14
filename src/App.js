import './App.css';
import React, {useEffect, useState} from "react";
import firebase from './firebase';

import {useNotifications} from './components/hooks'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LandingPage from './components/LandingPage';
import NavBar from './components/NavBar';
import Homepage from './components/Homepage.js';
import UserProfile from './components/UserProfile';
import Notification from './components/Notification';
import Calendar from './components/CalendarTest'
import Settings from './components/Settings';

function App() {
  // const [notifications, setNotifications]=useState([])
  const userId = localStorage.loggedUserId;    
  const loggedInd = localStorage.loggedInd;
  const [notifications] = useNotifications(userId);

  return (
    <div className="App">
      <Router>
        {/* <NavBar loggedInd={loggedInd}/> */}
      {/* navbar containes logout, profile and search bar options */}
        <Routes>
          {/* landing or welcome page for new users where they can sign up or log in */}
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/Welcome' element={<LandingPage/>}/>
          {/* <Route path='/Calendar' element={<Calendar/>}/> */}

          {/* users homepage once they are logged in*/}
          <Route path='/Notification' element={<Notification/>}/>
          <Route path='/Settings' element={<Settings/>}/>
          <Route path='/Homepage' element={<Homepage/>}/>

          {/* other users profile page */}
          <Route path='/userProfile/:userName/:userId' element={<UserProfile/>}/>
        </Routes>
        <footer>
          <p>Created at <a href="https://junocollege.com/">Juno College</a> by <a href="https://saramunir.com/">Sara Munir</a></p>
        </footer>
      </Router>
    </div>
  );
}

export default App;
