import './App.css';
import React from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import LandingPage from './components/LandingPage';
import NavBar from './components/NavBar';
import Homepage from './components/Homepage.js';
import UserProfile from './components/UserProfile';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      {/* navbar containes logout, profile and search bar options */}
      <NavBar/>
        <Routes>
          {/* landing or welcome page for new users where they can sign up or log in */}
          <Route exact path='/' element={<LandingPage/>}/>
          <Route exact path='/Welcome' element={<LandingPage/>}/>

          {/* users homepage once they are logged in*/}
          <Route path='/Homepage' element={<Homepage/>}/>

          {/* other users profile page */}
          <Route exact path='/userProfile/:userName/:userId' element={<UserProfile/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
