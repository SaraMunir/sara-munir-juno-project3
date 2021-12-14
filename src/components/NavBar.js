import {useEffect, useState} from 'react'
import { useNavigate, Link } from "react-router-dom";
import firebase from '../firebase';

import SearchBar from './SearchBar'
import './styles/NavStyle.css'

function NavBar(props) {
    const loggedInd = localStorage.loggedInd
    const sessionId = localStorage.sessionId;

    // const userId = localStorage.loggedUserId;
    let navigate = useNavigate();
    const [menuBtn, setMenuBtn]=useState(false)
    const [notifications, setNotifications]=useState([])
    
    const logOut = ()=>{
        // dbRef.child(id).remove();
        firebase.database().ref(`/sessions/${sessionId}`).remove()
            navigate(`/`); 
            localStorage.clear();
            window.location.reload(false);
    }
    const redirectTo=()=>{
        navigate(`/Homepage`);
        setMenuBtn(!menuBtn)
    }
    const showMenu = ()=>{
        setMenuBtn(!menuBtn)
    }
    useEffect(() => {
        // getting the viewers data as well
        
        setTimeout(() => {
            firebase.database().ref().orderByChild('dataType').equalTo('notification').on('value', (response)=>{
                const data = response.val();
                const dataArray = []
                for (let key in data) {
                    // making sure to add the id inside the object as well.
                    const newObject = {...data[key], id: key}
                        // then pushing the users in the users array. 
                    dataArray.push(newObject)
                }

                const usersNotificationArr = []
                dataArray.forEach(notifi=>{
                    if(notifi.userId === props.userId && notifi.read === false){
                        usersNotificationArr.push(notifi)
                    }
                })
                // console.log('usersNotificationArr', usersNotificationArr)
                setNotifications(usersNotificationArr)
                // console.log('usersNotification : ', usersNotification)
            })
            
        }, 500);
    }, [props.userId]) 
    return (
        <nav className="wrapper">
            {
                // only users who are logged in will be able to see the nav menu
                loggedInd == true || loggedInd == "true"  ?
                <div className="navContainer">
                    {/* search bar to find other users */}
                    <SearchBar/>
                    {/* option to show menu for the users */}
                    <button onClick={showMenu} className="profileMenuBtn"> 
                    {
                            notifications.length > 0 ?
                        <div className="notificationNum" >
                            <p>
                                {notifications.length}
                            </p>
                        </div>
                        : null
                    }

                        <i className="profileIcon fas fa-2x fa-user-circle"></i>
                    </button>
                    {
                        menuBtn ?
                        <ul className='dropDown'>
                            <li><button onClick={()=>redirectTo('myProfile')}>My Profile</button></li>
                            <li>
                                <Link to="/Notification">
                                    <button className='notifCntr'>
                                        Notification { notifications ? <span className="notNum">{notifications.length}</span>:null}  
                                    </button>
                                </Link>
                            </li>
                            <li>
                                <Link to="/Settings">
                                    <button className='notifCntr'>
                                        Settings
                                    </button>
                                </Link>
                            </li>
                            <li><button onClick={logOut}>Log Out <i className="fas fa-sign-out-alt"></i></button></li>
                        </ul> 
                        : null
                    }
                </div>
            : null
            }
        </nav>
    )
}

export default NavBar
