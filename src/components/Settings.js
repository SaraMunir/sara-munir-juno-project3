import React, { useEffect, useState, useRef } from 'react';
import firebase from '../firebase';
import NavBar from './NavBar';
import bcrypt from 'bcryptjs'



function Settings() {
    const sessionId = localStorage.sessionId;    
    const [ opneNameForm, setOpenNameForm ] = useState(false)
    const [ opnePasswordForm, setOpenPasswordForm ] = useState(false)
    const [ userId, setUserId ] = useState('')
    const [ userData, setUserData ] = useState({})
    const [ userPassWord, setPassWord ] = useState({newPassword: '', confirmPassword: ''})
    const [ doesPasswordMatch, setDoesPasswordMatch ] = useState(false)
    const [ userName, setUserName ] = useState({fullName: ''});
    const inputPassword = useRef();
    const inputFullName = useRef();
    const [alert, setAlert] = useState({
        show: false, alertText: ''
    })
    const handleNameInput = (e)=>{
        const {value, id} = e.target
        setUserName({...userName, [id]: value})
    }
    const handleNewPassworInput = (e)=>{
        const {value, id} = e.target
        setPassWord({...userPassWord, [id]: value})
        setDoesPasswordMatch(false)
    }
    const handleConfirmPassworInput = (e)=>{
        const {value, id} = e.target
        setPassWord({...userPassWord, [id]: value})
        if(value === userPassWord.newPassword){
            setDoesPasswordMatch(true)
        }else {
            setDoesPasswordMatch(false)
        }
    }
    const changePassword = (e)=>{
        e.preventDefault()
        if(doesPasswordMatch){
            // check user passwad is not empty and more than 8 
            if(userPassWord.newPassword === "" ){
                inputPassword.current.focus();
                setDoesPasswordMatch(false)
            }
            if( userPassWord.newPassword === "" || userPassWord.newPassword.length < 8) {
                inputPassword.current.focus();
                setAlert( { show: true, alertText: 'Please provide a password that is atleast 8 characters!' } );
                return;
            } 
            setAlert({show: false, alertText: ''})
            const saltRounds = 10;
            const hash = bcrypt.hashSync(userPassWord.newPassword, saltRounds);
            const newPasswordObj = {
                password: hash,
                hashed: true
            }
            firebase.database().ref(`${userId}`).update(newPasswordObj);
            setPassWord({newPassword: '', confirmPassword: ''})
            setOpenPasswordForm(!opnePasswordForm)
        }
    }
    const submitNamechange = (e)=>{
        e.preventDefault()
        if (userName.fullName === ''){
            inputFullName.current.focus();
            console.log('name cant be empty')
            return
        }
        if(userName.fullName === userData.fullName){
            console.log('name is the same so wont execute funtion')
            setOpenPasswordForm(!opneNameForm)
            return
        } else {
            firebase.database().ref(`${userId}`).update(userName);
            setOpenNameForm(!opneNameForm)
        }
    }
    
    useEffect(() => {
        // getting the viewers data as well
        let ownersId
        firebase.database().ref(`/sessions/${sessionId}`).on('value', (response)=>{
            const data = response.val();
            let sessionData 
            for (let key in data) {
                // making sure to add the id inside the object as well.
                const newObject = {...data[key]}
                    // then pushing the users in the users array. 
                    sessionData= newObject
            }
            setUserId(sessionData.userId)
            ownersId=sessionData.userId
            const dbRef = firebase.database().ref(`/${ownersId}`);
            dbRef.on('value', (response)=>{
                const usersInfo =response.val()
                setUserData(response.val())
                setUserName({...userName, fullName: response.val().fullName})
            })
        })
    }, [])

    return (

        <>
        <NavBar  userId = {userId}/>
            <section className='settings'>

                <h1>General Settings</h1>
                <div className='lineBreakSettings'></div>
                <ul>
                    <li className='settingsItem row'>
                        <h3 className='category testBorder settingsBox'>UserName</h3>
                        <div  className='value testBorder settingsBox'>
                            {
                                opneNameForm ? 
                                <form onSubmit={submitNamechange}>
                                    <label htmlFor="fullName"></label>
                                    <input className='settingInput' type="text" ref={inputFullName}
                                    id="fullName" name="fullName" onChange={handleNameInput} value={userName.fullName}
                                    />
                                    {userName.fullName? 
                                    userName.fullName !== userData.fullName ?
                                    <button className='simpleBtn' >Save Password</button>
                                    : <button className='simpleBtn diabled' disabled>Save Password</button> 
                                    : <button className='simpleBtn diabled' disabled>Save Password</button> }
                                </form> : 
                                <h2>{userData.fullName}</h2>
                            }
                        </div>
                        <button className='editSettingsBtn testBorder settingsBox' onClick={()=>setOpenNameForm(!opneNameForm)}>
                            {
                                opneNameForm ? 
                                <i className="fas fa-times"></i>
                                : 
                                <i className="fas fa-user-edit"></i>
                            }
                        </button>
                    </li>
                    <li className='settingsItem row'>
                        <h3 className='category testBorder settingsBox'>UserName</h3>
                        <div  className='value testBorder settingsBox'>
                            {
                                opnePasswordForm ? 
                                <form onSubmit={changePassword} >
                                    <div>
                                        <label className='settingInpLbl' htmlFor="newPassword">New Password</label>
                                        <input 
                                        ref={inputPassword}                                         className='settingInput' type="password"
                                        id="newPassword" name="password" value={userPassWord.newPassword}
                                        placeholder='new password'
                                        onChange={handleNewPassworInput}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="confirmPassword">Confirm Password</label>
                                        <input className='settingInput' type="password"
                                        id="confirmPassword" name="password" value={userPassWord.confirmPassword}
                                        placeholder='confirm password'
                                        onChange={handleConfirmPassworInput}
                                        />
                                        {doesPasswordMatch ===false?
                                        userPassWord.confirmPassword===''?null:
                                        <div  className="alertBox">
                                            <p className='alert'>password does not match</p> 

                                        </div>
                                        : null
                                        }
                                        {
                                            alert.show ? 
                                            <div className="alertBox">
                                            <p>{alert.alertText}</p>
                                        </div> : null
                                        }
                                    </div>
                                    {doesPasswordMatch ? 
                                    <button className='simpleBtn' >Save Password</button>
                                    : <button className='simpleBtn diabled' disabled>Save Password</button> }
                                </form> : 
                                <h2>************</h2>
                            }
                        </div>
                        <button className='editSettingsBtn testBorder settingsBox' onClick={()=>setOpenPasswordForm(!opnePasswordForm)}>
                            {
                                opnePasswordForm ? 
                                <i className="fas fa-times"></i>
                                : 
                                <i className="fas fa-user-edit"></i>
                            }
                        </button>
                    </li>
                    {/* <li className='settingsItem row'>
                        <h3 className='category testBorder settingsBox'>Theme</h3>
                        <h2 className='value testBorder settingsBox'>Light</h2>
                        <button className='editSettingsBtn testBorder settingsBox'><i className="fas fa-user-edit"></i></button>
                    </li> */}
                </ul>
            </section>
        
        </>
    )
}
export default Settings
