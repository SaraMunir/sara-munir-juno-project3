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
    const notificationRead=(e, anotherTry)=>{
        // e.preventDefault()
        // console.log('e: ', e.target.id)
        console.log('id: ', anotherTry)
        firebase.database().ref(`/${anotherTry}`).update({read : true})
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
                    not.map(notif=>{
                    switch (notif.type) {
                        case "followersPost": return  <Link  to={`/Notification/post/${notif.postId}`} key={notif.id} onClick={(e)=>notificationRead(e,notif.id)} id={notif.id} >
                            <li>
                                <div>
                                    {
                                    allUsers.map(user=>
                                        user.id === notif.postersId ? 
                                        <p key={`user${user.id}`} >
                                            <img className="smallThmbNail" src={user.profileImg ? user.profileImg.imageUrl : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"} alt={`image of ${user.fullName}`} />
                                            {user.fullName} posted on your wall
                                        </p>
                                        : null
                                        )
                                    }
                                </div>
                            </li>
                            </Link>
                            ;
                        case  "commentOnPost": return <Link to={`/Notification/comment/${notif.postId}/${notif.commentId}`} key={notif.id} onClick={(e)=>notificationRead(e,notif.id)} id={notif.id}><li   >
                                <div>
                                    {
                                        notif.postType ==='userPost' ? 
                                        <p>
                                            {allUsers.map(user=>
                                                user.id === notif.commenterId ?
                                                <span key={notif.id}> <img className="smallThmbNail" src={user.profileImg ? user.profileImg.imageUrl : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"} alt={`image of ${user.fullName}`} /> {user.fullName} </span> : null
                                                )} commented on your post
                                        </p>
                                        : null
                                    }
                                    {
                                        notif.postType ==='followersPost' ? 
                                            notif.who ==='owner' ? 
                                            allUsers.map(user=>
                                                user.id === notif.commenterId ? 
                                                <p key={notif.id}>
                                                    <img className="smallThmbNail" src={user.profileImg ? user.profileImg.imageUrl : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"} alt={`image of ${user.fullName}`} />
                                                    {user.fullName} commented on your followers post
                                                </p>
                                                : null
                                                )
                                                : null
                                        : null
                                    }
                                    {
                                        notif.postType ==='followersPost' ? 
                                        notif.who ==='follower' ? 
                                        <p>
                                            {allUsers.map(user=>
                                                user.id === notif.commenterId ? 
                                                <span key={notif.id}>
                                                    <img className="smallThmbNail" src={user.profileImg ? user.profileImg.imageUrl : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"} alt={`image of ${user.fullName}`} /> {user.fullName} </span>
                                                : null
                                                )}
                                            commented on your post on {
                                            allUsers.map(user=>
                                                user.id === notif.wallOwner ? 
                                                    user.fullName
                                                : null
                                                )
                                        }'s wall </p> 
                                        : 
                                        null
                                        : null
                                    }
                                    {/* {
                                        notif.who ==='owner' ? 
                                        allUsers.map(user=>
                                            user.id === notif.commenterId ? 
                                            <p>
                                                <img className="smallThmbNail" src={user.profileImg ? user.profileImg.imageUrl : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"} alt={`image of ${user.fullName}`} />
                                            {user.fullName} commented on your followers post
                                            </p>
                                            : null
                                            )
                                            : null
                                    }
                                {
                                    notif.who ==='follower' ? 
                                    <p>
                                        {allUsers.map(user=>
                                            user.id === notif.commenterId ? 
                                            <span>
                                                <img className="smallThmbNail" src={user.profileImg ? user.profileImg.imageUrl : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"} alt={`image of ${user.fullName}`} /> {user.fullName} </span>
                                            
                                            : null
                                            )}
                                        commented on your post on {
                                        allUsers.map(user=>
                                            user.id === notif.wallOwner ? 
                                                user.fullName
                                            : null
                                            )
                                    }'s wall </p> 
                                    : 
                                    null
                                } */}
                                </div>
                            </li>
                            </Link>;
                        case "replyOnPost": return <Link to={`/Notification/reply/${notif.postId}/${notif.whichComment}`} key={notif.id} onClick={(e)=>notificationRead(e,notif.id)} id={notif.id}>
                        <li >
                                <div>
                                    {
                                    allUsers.map(user=>
                                        user.id === notif.replierId ? 
                                        <p key={`user${user.id}`} >
                                            <img className="smallThmbNail" src={user.profileImg ? user.profileImg.imageUrl : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"} alt={`image of ${user.fullName}`} />
                                            {user.fullName} replied on your comment
                                        </p>
                                        : null
                                        )
                                    }
                                </div>
                            </li>
                            </Link>;
                            default:   return null;
                            }
                        }
                        )
                        : 
                        <p>you currently have no notification</p>
                    }
                </ul>
            </section>
        </>

    )
}
export default Notification
