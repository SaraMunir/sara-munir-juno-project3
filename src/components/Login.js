import  {useState, useEffect, useRef} from 'react'
import firebase from '../firebase';
import loadingIcon from './assets/Bars-1s-200px.gif'

function Login() {
    const [user, setUser] = useState({
        emailAddress: '', password: ''
    })
    const [users, setUsers] = useState([]);
    const [alert, setAlert] = useState({
        show: false, alertText: ''
    })
    const [ isLoggedIn, setIsLoggedIn ] = useState( false );

    const inputEmail = useRef();
    const inputPassword = useRef();

    const handleInput = (e)=>{
        const { id, value } = e.target;
        setUser({...user, [id]: value})
    }

    const handleLogInSubmit = (event) => {
        // prevent reload
        event.preventDefault();
        // check user email is provided
        if( user.emailAddress === "" ) {
            inputEmail.current.focus();
            setAlert( { show: true, alertText: 'Please provide your Email Address!' } );
            return;
        }
        // check user passwad is not empty and more than 8 
        if( user.password === "") {
            inputPassword.current.focus();
            setAlert( { show: true, alertText: 'Please provide a password !' } );
            return;
        }
        let userFound = false
        // find user from the users object by email and then check if password match. 
        console.log('users: ', users)
        if (user.lengt>0){
            users.forEach(eachUser=>{
                if (eachUser.emailAddress === user.emailAddress){
                    userFound = true
                    // if user email matches check if password matches
                    if (eachUser.password === user.password){
                        // if password matches print out alert
                        setAlert( { show: true, alertText: 'Success loggin In' } );
                        // log in user state and redirect to homepage
                        localStorage.setItem("loggedInd", true);
                        localStorage.setItem("emailAddress", user.emailAddress)
                        setUser({ emailAddress: '', password: ''})
                        setIsLoggedIn(true); 
                        setTimeout( function(){ 
                            document.location.reload(true);
                        }, 1500 );
                    }else {
                        // if password doesnt match print out alert
                        setAlert( { show: true, alertText: 'Password inccorrect' } );
                        return
                    }
                } 
                if (userFound === false){
                    console.log('user not found');
                    setAlert( { show: true, alertText: 'Sorry no user associated with this email address. please signup' } );
                }
            })
        }else {
            setAlert( { show: true, alertText: 'Sorry no user associated with this email address found. please signup?' } );
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
                    <h2>Loggin In</h2>
                    <img className="loadingIcon" src={loadingIcon} alt="loading icon" /> 
                </>
                    :
                <>
                    <h2>Log In</h2>
                    <form onSubmit={handleLogInSubmit}>
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
                            <button className="initialBtnSettng submitBtn">Log In</button>
                        </div>
                    </form>
                </>
                }
        </div>
    )
}

export default Login;
