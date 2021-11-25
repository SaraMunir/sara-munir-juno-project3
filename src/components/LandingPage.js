import { useState} from 'react';
import { Navigate } from 'react-router-dom';

import './styles/HeaderStyle.css'
import heroImage from './assets/5848200.png'
import Login from './Login';
import SignUp from './SignUp';

function LandingPage() {

    const isLoggedIn = localStorage.loggedInd;
    const [modalOpen, setModalOpen]= useState(false);
    const [login, setLoging]= useState(false);
    const [signUp, setSignUp]= useState(false);
    
    
    const modalWindow = (type)=>{
        if ( modalOpen === false ){
            setModalOpen(true)
            if (type === 'logIn'){
                // when user selects login the modal for the login form opens up 
                setLoging(true)
                setSignUp(false)
            }
            if (type === 'signUp'){
                // when user selects sign up the modal for the sign up form opens up 
                setSignUp(true)
                setLoging(false)
            }
        } else {
            setModalOpen(false)
        }
    }
    return (
        <header>
        { isLoggedIn == "true" ? <Navigate to='/Homepage' /> : null }

            <div className="row jstfyCntEnd wrapper loginBtnCntr">
                <button className="initialBtnSettng specialBtn btnPurple" onClick={()=>modalWindow('logIn')}>Log in</button>
            </div>
            <div className='row jstfyCntSpEvn algnItm wrapper'>
                <div className="heroText">
                    <h1>Thought Escape</h1>
                    <p>Share your Thoughts! Like other's thought! </p>
                    <button className="initialBtnSettng specialBtn btnYellow" onClick={()=>modalWindow('signUp')}>Sign Up</button>
                </div>
                <img className="heroImg" src={heroImage} alt="people talking" />
            </div>
            {modalOpen ? 
            <div className="modalWindow">
                <div className="modalWindowCntr">
                    <h2 className="logo">TS</h2>
                    <div className="row jstfyCntEnd">
                        <button className="modalCloseBtn" onClick={()=>modalWindow()}><i className="fas fa-2x fa-times"></i></button>
                    </div>
                    {/* forms */}
                    { login ? <Login/> : null }
                    { signUp ? <SignUp/> : null }
                </div>
            </div>
            :
            null
        }
        </header>
    )
}

export default LandingPage
