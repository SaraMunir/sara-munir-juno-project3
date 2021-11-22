import './App.css';
import React from "react";
import {   BrowserRouter,
  Routes,
  Route} from "react-router-dom";
import LandingPage from './components/LandingPage';
import NavBar from './components/NavBar';
import Homepage from './components/Homepage.js';
import UserProfile from './components/UserProfile';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <NavBar/>
        <Routes>
          {/* <Route path="expenses" element={<LandingPage />} /> */}
          <Route exact path='/' element={<LandingPage/>}/>
          <Route exact path='/Welcome' element={<LandingPage/>}/>
          <Route path='/Homepage' element={<Homepage/>}/>
          <Route exact path='/userProfile/:userName/:userId' element={<UserProfile/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
