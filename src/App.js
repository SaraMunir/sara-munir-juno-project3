import './App.css';
import React, {useEffect, useState} from "react";
import firebase from './firebase';

import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LandingPage from './components/LandingPage';
import NavBar from './components/NavBar';
import Homepage from './components/Homepage.js';
import UserProfile from './components/UserProfile';
import Notification from './components/Notification';
import Calendar from './components/CalendarTest'

function App() {
  const [notifications, setNotifications]=useState([])
  const userId = localStorage.loggedUserId;    
  const loggedInd = localStorage.loggedInd;


  useEffect(() => {
    
    // getting the viewers data as well
    firebase.database().ref().orderByChild('dataType').equalTo('notification').on('value', (response)=>{
        const data = response.val();
        const dataArray = []
        for (let key in data) {
            // making sure to add the id inside the object as well.
            const newObject = {...data[key], id: key}
                // then pushing the users in the users array. 
            dataArray.push(newObject)
        }
        // const usersNotifications
        const usersNotification = dataArray.filter(notifi=>{
            return notifi.userId === userId && notifi.read === false
        })
        setNotifications(usersNotification)
    })
}, [])
  return (
    <div className="App">
      <Router>

        <NavBar notifications={notifications} loggedInd={loggedInd}/>
      {/* navbar containes logout, profile and search bar options */}
        <Routes>
          {/* landing or welcome page for new users where they can sign up or log in */}
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/Welcome' element={<LandingPage/>}/>
          <Route path='/Calendar' element={<Calendar/>}/>

          {/* users homepage once they are logged in*/}
          <Route path='/Homepage' element={<Homepage/>}/>
          <Route path='/Notification' element={<Notification notifications={notifications}/>}/>

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
