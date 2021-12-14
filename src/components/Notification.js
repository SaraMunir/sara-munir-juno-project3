import React, { useEffect, useState } from 'react';
import { Link, Navigate } from "react-router-dom";
import {useFetchAllUser} from './hooks'
import firebase from '../firebase';
import NavBar from './NavBar';

function Notification() {
    const [ userId, setUserId] = useState('')
    const isLoggedIn = localStorage.loggedInd;
    const [allUsers] = useFetchAllUser()
    const sessionId = localStorage.sessionId;    
    const [not, setNots] = useState([])
    const deleteNotification=(e)=>{
        console.log('e: ', e.target.id)
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
            console.log('sessionData', sessionData)
        })
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
                return notifi.userId === ownersId && notifi.read === false
            })
            console.log(usersNotification)
            const sortingArrays = usersNotification.sort((a,b)=>{
                let A = a.timeStamp
                let B = b.timeStamp
                if(A.year > B.year) return -1
                if(A.year < B.year) return 1
                if(A.month > B.month) return -1
                if(A.month < B.month) return 1
                if(A.date > B.date) return -1
                if(A.date < B.date) return 1
                if(A.hours > B.hours) return -1
                if(A.hours < B.hours) return 1
                if(A.minutes > B.minutes) return -1
                if(A.minutes < B.minutes) return 1
            })
            setNots(sortingArrays)
        })
    }, [])
    return (
        <>
            <NavBar userId={userId}/>
            <section className="notificationContainer wrapper">
            { isLoggedIn !== "true" ? <Navigate to='/' /> : null }
                <ul>
                    {
                        not.length>0 ?
                        not.map(notif=>
                        <li key={notif.id} id={notif.id} onClick={deleteNotification} >
                            <p>{notif.posts}</p>
                            <p>{notif.type}</p>
                            <p>posted by {
                                allUsers.map(user=>
                                    user.id === notif.postersId ? 
                                    <div>
                                        {user.fullName} 
                                    </div>
                                    : null
                                    )
                            }
                            </p>
                            
                        </li>
                        )
                        : null
                    }
                </ul>
                <ul>

                </ul>
            </section>
        </>

    )
}
export default Notification
