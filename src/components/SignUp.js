import {useState, useEffect, useRef} from 'react';
import loadingIcon from './assets/Bars-1s-200px.gif'
import { useNavigate } from "react-router-dom";
import bcrypt from 'bcryptjs'
import firebase from '../firebase';
import { v4 as uuidv4 } from 'uuid';

function SignUp() {
    // to redirect user once they log in to their profile/homepage
    let navigate = useNavigate();

    const [user, setUser] = useState({
        fullName: '', emailAddress: '', password: '', dataType: 'userAccounts'
    })
    const [users, setUsers] = useState([])
    const [alert, setAlert] = useState({
        show: false, alertText: ''
    })
    const [ isLoggedIn, setIsLoggedIn ] = useState( false );
    const inputEmail = useRef();
    const inputName = useRef();
    const inputPassword = useRef();




    const handleInput = (e)=>{
        const { id, value } = e.target;
        setUser({...user, [id]: value})
    }
    const handleSubmit = (event) => {
        const sessionId = uuidv4();

        event.preventDefault();
        // check if users email already exists in data base. 
        let doesEmailExist = false;
        users.forEach(eachUser=>{
            if (eachUser.emailAddress === user.emailAddress){
                console.log('email Exists')
                doesEmailExist = true;
                return;
            } 
        })
        // check user name is provided
        
        if( user.fullName === "" ) {
            inputName.current.focus();
            setAlert( { show: true, alertText: 'Please provide your Full Name!' } );
            return;
        }
        // check user email is provided
        if( user.emailAddress === "" ) {
            inputEmail.current.focus();
            setAlert( { show: true, alertText: 'Please provide your Email Address!' } );
            return;
        }
        if( !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user.emailAddress)) ) {
            inputEmail.current.focus();
            setAlert( { show: true, alertText: 'Please provide a valid Email!' } );
            return;
        }
        // check user passwad is not empty and more than 8 
        if( user.password === "") {
            inputPassword.current.focus();
            setAlert( { show: true, alertText: 'Please provide a password that is atleast 8 characters!' } );
            return;
        }
        // check user passwad is not empty and more than 8 
        if( user.password.length < 8) {
            inputPassword.current.focus();
            setAlert( { show: true, alertText: 'Please provide a password that is atleast 8 characters!' } );
            return;
        }
        // check if there already an email address exists or not 

        if (doesEmailExist === true){
            inputEmail.current.focus();
            setAlert( { show: true, alertText: `There is already an account that exists with this email address` } );
        } else {
            //  we proceed to create an account. 
            setAlert( { show: false, alertText: '' } );
            const dbRef = firebase.database().ref();
        
            console.log('password: ', user.password)
            const saltRounds = 10;
            const hash = bcrypt.hashSync(user.password, saltRounds);
            let newUser = {...user, password: hash, hashed: true}
            console.log("newUser: ", newUser)
            dbRef.push(newUser);
            const dbRef2 = firebase.database().ref(`sessions/${sessionId}`);
            let sessionObject = {
                sessionId: sessionId, 
                emailAddress: user.emailAddress, 
            }
            dbRef2.push(sessionObject);
            // we save the
            localStorage.setItem("loggedInd", true);
            localStorage.setItem("sessionId", sessionId);

            setUser({...user, fullName: '', emailAddress: '', password: ''})
            setIsLoggedIn(true); 
            navigate(`/Homepage`);
        }
    }
    useEffect(() => {
        // loading users 
        const dbRef = firebase.database().ref();
        dbRef.on('value', (response)=>{
            const data = response.val()
            const dataArray = []
            for (let key in data) {
                const newObje = {...data[key], id: key}
                dataArray.push(newObje)
            }
            setUsers(dataArray)
        })
    }, [])
    return (
        <div className="modalCntr">
            {
                isLoggedIn ?
                <>
                    <h2>Sign Up</h2>
                    <img className="loadingIcon" src={loadingIcon} alt="loading icon" /> 
                </>
                :
                <>
                    <h2>Sign Up</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="inputCntr">
                            <label htmlFor="fullName">Your Name</label>
                            <input
                            ref={inputName}
                            type="text"  
                            placeholder="Name" 
                            id="fullName"
                            onChange={handleInput}
                            value={user.fullName}
                            />
                        </div>
                        <div className="inputCntr">
                            <label htmlFor="emailAddress">Email Address</label>
                            <input type="text"  placeholder="Email Address" 
                            ref={inputEmail}
                            id="emailAddress"
                            onChange={handleInput}
                            value={user.emailAddress}
                            />
                        </div>
                        <div className="inputCntr">
                            <label htmlFor="password">Password</label>
                            <input type="password"  placeholder="Enter Password" 
                            ref={inputPassword}
                            id="password"
                            onChange={handleInput}
                            value={user.password}
                            />
                        </div>
                        { alert.show ? 
                        <div className="alertBox">
                            <p>{alert.alertText}</p>
                        </div>
                        : null
                        }
                        <div className="row jstfyCntCenter">
                            <button className="initialBtnSettng submitBtn">Create Account</button>
                        </div>
                    </form>
                
                </>

            }
        </div>
    )
}

export default SignUp
