import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

import firebase from '../firebase';

function Notification() {
    const userId = localStorage.loggedUserId;    
    const [not, setNots] = useState([])
    const deleteNotification=(e)=>{
        console.log('e: ', e.target.id)
    }
    useEffect(() => {
        // getting the viewers data as well
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
                return notifi.userId === userId && notifi.read === false
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
        <section className="notificationContainer wrapper">
            <ul>
                {
                    not.length>0 ?
                    not.map(notif=>
                    <li key={notif.id} id={notif.id} onClick={deleteNotification} >
                        {notif.posts}
                    </li>
                    )
                    : null
                }
            </ul>
        </section>
    )
}
export default Notification
