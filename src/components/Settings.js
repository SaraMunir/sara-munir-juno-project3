import React, { useEffect, useState } from 'react';
import firebase from '../firebase';


function Settings() {
    const sessionId = localStorage.sessionId;    
    const[ opneNameForm, setOpenNameForm] = useState(false)
    const [ userId, setUserId] = useState('')
    const [ userData, setUserData] = useState({})

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
            console.log('sessionData', sessionData)
            
            const dbRef = firebase.database().ref(`/${ownersId}`);
            dbRef.on('value', (response)=>{
                console.log('user:', response.val())
                setUserData(response.val())
            })
        })
    }, [])

    return (
        <section className='settings'>
            <h1>General Settings</h1>
            <hr />
            <ul>
                <li className='settingsItem row'>
                    <h3 className='category testBorder settingsBox'>UserName</h3>
                    <div  className='value testBorder settingsBox'>
                        {
                            opneNameForm ? 
                            <form>
                                <label htmlFor="name"></label>
                                <input type="text"
                                id="fullName" name="fullName" value={userData.fullName}
                                />
                            </form> : 
                            <h2>{userData.fullName}</h2>
                        }
                    </div>
                    <button className='editSettingsBtn testBorder settingsBox' onClick={()=>setOpenNameForm(!opneNameForm)}>
                        {
                            opneNameForm ? 
                            <p>close</p> 
                            : 
                            <i class="fas fa-user-edit"></i>
                        }
                    </button>
                </li>
                <li className='settingsItem row'>
                    <h3 className='category testBorder settingsBox'>Password</h3>
                    <h2 className='value testBorder settingsBox'>************</h2>
                    <button className='editSettingsBtn testBorder settingsBox'><i class="fas fa-user-edit"></i></button>
                </li>
                <li className='settingsItem row'>
                    <h3 className='category testBorder settingsBox'>Theme</h3>
                    <h2 className='value testBorder settingsBox'>Light</h2>
                    <button className='editSettingsBtn testBorder settingsBox'><i class="fas fa-user-edit"></i></button>
                </li>
            </ul>
        </section>
    )
}
export default Settings
