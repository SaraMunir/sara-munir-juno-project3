import {useState} from 'react'
import { useNavigate } from "react-router-dom";

import SearchBar from './SearchBar'
import './styles/NavStyle.css'
// const loggedInd = localStorage.loggedInd

function NavBar(props) {
    let navigate = useNavigate();
    const [menuBtn, setMenuBtn]=useState(false)
    const logOut = ()=>{
        localStorage.clear();
        navigate(`/`);
    }
    const redirectTo=()=>{
        navigate(`/Homepage`);
        setMenuBtn(!menuBtn)

    }
    const showMenu = ()=>{
        setMenuBtn(!menuBtn)
    }
    return (
        <nav className="wrapper">
            {
                // only users who are logged in will be able to see the nav menu
                props.loggedInd ?
                <div className="navContainer">
                    {/* search bar to find other users */}
                    <SearchBar/>
                    {/* option to show menu for the users */}
                    <button onClick={showMenu} className="profileMenuBtn">
                        <i className="profileIcon fas fa-2x fa-user-circle"></i>
                    </button>
                    {
                        menuBtn ?
                        <ul className='dropDown'>
                            <li><button onClick={()=>redirectTo('myProfile')}>My Profile</button></li>
                            <li><button>Notification</button></li>
                            <li><button>Settings</button></li>
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
