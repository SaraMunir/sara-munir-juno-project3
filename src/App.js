import './App.css';
import React, {useEffect, useState} from "react";
import firebase from './firebase';

import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LandingPage from './components/LandingPage';
import NavBar from './components/NavBar';
import Homepage from './components/Homepage.js';
import UserProfile from './components/UserProfile';
import Notification from './components/Notification';
import Settings from './components/Settings';
import NotificationDetail from './components/NotificationDetail';
import Followers from './components/Followers';

function App() {
  return (
    <div className="App">
      <Router>
      {/* navbar containes logout, profile and search bar options */}
        <Routes>
          {/* landing or welcome page for new users where they can sign up or log in */}
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/Welcome' element={<LandingPage/>}/>
          {/* <Route path='/Calendar' element={<Calendar/>}/> */}

          {/* users homepage once they are logged in*/}
          <Route path='/Notification' element={<Notification/>}/>
          <Route path='/Notification/:type/:typeId' element={<NotificationDetail/>}/>
          <Route path='/Notification/:type/:typeId/:commentId' element={<NotificationDetail/>}/>
          <Route path='/Settings' element={<Settings/>}/>
          <Route path='/Homepage' element={<Homepage/>}/>
          <Route path='/followers/:userId' element={<Followers/>}/>

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
