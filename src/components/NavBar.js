import {useState} from 'react'
import './styles/NavStyle.css'
const loggedInd = localStorage.loggedInd

function NavBar() {
    const [menuBtn, setMenuBtn]=useState(false)
    const logOut = ()=>{
        localStorage.clear();
        document.location.reload(true)
    }
    const showMenu = ()=>{
        setMenuBtn(!menuBtn)
    }
    return (
        <nav className="wrapper">
            <form action="" className='searchInput'>
                <input type="text" />
                <button><i className="fas fa-search"></i></button>
            </form>
            {
                loggedInd ?
                <div>
                    <button onClick={showMenu} className="profileMenuBtn">
                        <i className="profileIcon fas fa-2x fa-user-circle"></i>
                    </button>
                    {
                        menuBtn ?
                        <ul className='dropDown'>
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
