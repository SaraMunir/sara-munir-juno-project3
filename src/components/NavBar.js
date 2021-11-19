import React from 'react'
import { Link } from "react-router-dom";
import './styles/NavStyle.css'
const loggedInd = localStorage.loggedInd

function NavBar() {
    return (
        <nav className="wrapper">
            {
                loggedInd ?
            <ul>
                <li>
                    {/* <Link to="/profile"> <i className="fas fa-2x fa-user-circle"></i>
                    </Link> */}
                    <button>
                        <i className="fas fa-2x fa-user-circle"></i>
                    </button>
                </li>
                <ul className='dropDown'>
                    <li>Log out</li>

                </ul>
            </ul>
            : null
            }
        </nav>
    )
}

export default NavBar
