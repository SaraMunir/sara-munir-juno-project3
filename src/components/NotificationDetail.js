import React, { useEffect, useState } from 'react';
import firebase from '../firebase';
import {  Link, useParams } from "react-router-dom";
import ReadPost from './ReadPost';
import {useFetchAllUser, useUserIdFromSessionId} from './hooks';
import NavBar from './NavBar';
import CommentCard from './CommentCard';
import { v4 as uuidv4 } from 'uuid';



function NotificationDetail() {

    const [ userId, setUserId] = useState('')
    const { type } = useParams();
    const { typeId } = useParams();
    const { commentId } = useParams();
    const [allUsers] = useFetchAllUser()
    const [comments, setComments] = useState([])
    const sessionId = localStorage.sessionId;    
    const [viewersId] = useUserIdFromSessionId(sessionId)
    const [comment, setComment] = useState('');


    const [post, setPost] = useState({})
    const handleCommentInput =(e)=>{
        setComment(e.target.value)
    }
    const postAComment=(e)=>{
        e.preventDefault()
        const dbRef = firebase.database().ref();

        if (comment){
            // check if the post had been liked before or not
            if(post.comments){
             // if there was a comment we have to copy the likes in a new array constant
                const newList = [...post.comments];
                const id = uuidv4();
                // const dbRef = firebase.database().ref();
                // creating time stamps for the comments:
                const currentDate = new Date();
                const dateTime ={
                    date: currentDate.getDate(),
                    month: currentDate.getMonth(),
                    year: currentDate.getFullYear(),
                    hours: currentDate.getHours(), 
                    minutes: currentDate.getMinutes(),
                    }
                //  creating the comment as an object with users id, postId so that i can pull data based on the id
                const commentObject ={
                    id:  id,
                    commenterId: viewersId,
                    comment: comment, 
                    timeStamp: dateTime,
                    postId: post.id
                } 
                if(viewersId === post.userId){
                    console.log('no need to notify yourself')
                    if(post.dataType ==='followersPost'){
                        const commentNotification = {
                            dataType: 'notification',
                            type: 'commentOnPost',
                            commentId: id,
                            commenterId: viewersId,
                            comment: comment, 
                            timeStamp: dateTime,
                            postId: post.id,
                            read: false, 
                            postType: post.dataType,
                            userId: post.userId,
                            who: 'owner'

                        }
                        const commentNotificationForFollowers = {
                            dataType: 'notification',
                            type: 'commentOnPost',
                            commentId: id,
                            commenterId: viewersId,
                            comment: comment, 
                            timeStamp: dateTime,
                            postId: post.id,
                            read: false, 
                            postType: post.dataType,
                            userId: post.postersId,
                            who: 'follower', 
                            wallOwner: post.userId,

                        }
                        dbRef.push(commentNotification);
                        dbRef.push(commentNotificationForFollowers);
                    }
                }else{
                    // if person commenting on the users post then only send notification to user
                    if(post.dataType ==='userPost'){
                        const commentNotification = {
                            dataType: 'notification',
                            type: 'commentOnPost',
                            commentId: id,
                            commenterId: viewersId,
                            comment: comment, 
                            timeStamp: dateTime,
                            postId: post.id,
                            read: false, 
                            postType: post.dataType,
                            userId: post.userId
                        }
                        dbRef.push(commentNotification);
                    }
                    // if person commenting on the users followers post then send notification to bot the user and the follower
                    if(post.dataType ==='followersPost'){
                        const commentNotification = {
                            dataType: 'notification',
                            type: 'commentOnPost',
                            commentId: id,
                            commenterId: viewersId,
                            comment: comment, 
                            timeStamp: dateTime,
                            postId: post.id,
                            read: false, 
                            postType: post.dataType,
                            userId: post.userId,
                            who: 'owner'

                        }
                        const commentNotificationForFollowers = {
                            dataType: 'notification',
                            type: 'commentOnPost',
                            commentId: id,
                            commenterId: viewersId,
                            comment: comment, 
                            timeStamp: dateTime,
                            postId: post.id,
                            read: false, 
                            postType: post.dataType,
                            userId: post.postersId,
                            who: 'follower', 
                            wallOwner: post.userId,

                        }
                        dbRef.push(commentNotification);
                        dbRef.push(commentNotificationForFollowers);
                    }
                }
                const commentObj ={
                    comments:newList
                }
                newList.push(commentObject)
                firebase.database().ref(`/${post.id}`).update(commentObj);
                setComment('')
                // loadPostDetail()

            }else {
                // since the post was not liked before we are creating a property of likes with
                const id = uuidv4();
                // const dbRef = firebase.database().ref();
                // creating time stamps for the comments:
                const currentDate = new Date();
                const dateTime ={
                    date: currentDate.getDate(),
                    month: currentDate.getMonth(),
                    year: currentDate.getFullYear(),
                    hours: currentDate.getHours(), 
                    minutes: currentDate.getMinutes(),
                    }
                 //  creating the comment as an object with users id, postId so that i can pull data based on the id
                const commentObject ={
                    id:  id,
                    commenterId: viewersId,
                    comment: comment, 
                    timeStamp: dateTime,
                    postId: post.id
                } 
                if(viewersId === post.userId){
                    console.log('no need to notify yourself')
                }else {
                    // if person commenting on the users post then only send notification to user
                    if(post.dataType ==='userPost'){
                        const commentNotification = {
                            dataType: 'notification',
                            type: 'commentOnPost',
                            commentId: id,
                            commenterId: viewersId,
                            comment: comment, 
                            timeStamp: dateTime,
                            postId: post.id,
                            read: false, 
                            postType: post.dataType,
                            userId: post.userId
                        }
                        dbRef.push(commentNotification);
                    }
                    // if person commenting on the users followers post then send notification to both the user and the follower
                    if(post.dataType ==='followersPost'){
                        // users notication
                        const commentNotification = {
                            dataType: 'notification',
                            type: 'commentOnPost',
                            commentId: id,
                            commenterId: viewersId,
                            comment: comment, 
                            timeStamp: dateTime,
                            postId: post.id,
                            read: false, 
                            postType: post.dataType,
                            userId: post.userId, 
                            who: 'owner'
                        }
                        // users followers notication
                        const commentNotificationForFollowers = {
                            dataType: 'notification',
                            type: 'commentOnPost',
                            commentId: id,
                            commenterId: viewersId,
                            comment: comment, 
                            timeStamp: dateTime,
                            postId: post.id,
                            read: false, 
                            postType: post.dataType,
                            userId: post.postersId,
                            who: 'follower', 
                            wallOwner: post.userId,
                        }
                        dbRef.push(commentNotification);
                        dbRef.push(commentNotificationForFollowers);
                    }
                }
                const commentObj ={
                    comments:[
                        commentObject
                    ]
                }
                firebase.database().ref(`/${post.id}`).update(commentObj);
                setComment('')
                // loadPostDetail()
            }
        }
    }
    useEffect (()=>{
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
        if(type === "comment"){
            firebase.database().ref(`${typeId}`).on('value', (response)=>{
                console.log(response.val())
                console.log(response.val().comments[0].comment)
                setComments(response.val().comments)
                setPost(response.val())
            })
            
        }
        if(type === "post"){
            firebase.database().ref().orderByChild(`postId`).equalTo(typeId).on('value', (response)=>{
                const data= response.val();
                let dataArray = []
                for(let key in data){
                    const newObject = {...data[key], id: key}
                    dataArray.push(newObject)
                }
                console.log(dataArray)
                dataArray.map(data=>{
                    if(data.dataType ==="followersPost"){
                        setPost(data)
                        setComments(data.comments)
                    }
                })
            })
        }
        if(type === "reply"){
            console.log(typeId)
            firebase.database().ref(`${typeId}`).on('value', (response)=>{
                console.log('reply working?')
                console.log(response.val())
                // setPost(response.val())
                const data= response.val();
                setPost(response.val())
                // console.log(dataArray)
                setComments(data.comments)
            })
        }
    }, [])

    return (
        <>
            <NavBar userId={userId}/>
            <div className='bigCard'>
                {
                    post.dataType === "followersPost" ? 
                    <div>
                        {
                            allUsers.map(user=>
                            user.id === post.postersId ?
                            <div className="postersCntr" key={user.id}>
                                <img className="mediumThmbNail" src={user.profileImg ? user.profileImg.imageUrl : 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png' } alt={`image of ${user.fullName}`} />
                                <div >
                                    <h3> {user.fullName }</h3>
                                    <p> {`${post.timeStamp.date}/${post.timeStamp.month}/${post.timeStamp.year}` }</p>
                                </div>
                            </div>
                            : null
                            )
                        }
                    </div>
                    : null
                }
                <p>{post.posts}</p>
                <h4>comments</h4>
                <form className="commentInput" onSubmit={postAComment}>
                    <label htmlFor="commentInput" hidden>Leave a comment</label>
                    <input id="commentInput" type="text" placeholder="Leave a Comment" onChange={handleCommentInput} value={comment}/>
                    <button className={comment ? "postBtn" : "postBtn postBtnGrey" }>Post A Comment</button>
                </form>
                
                <div className="allComments">
                    {
                        comments ?
                        comments.map(comment=>
                            <CommentCard  key={comment.id} comment={comment} allUsers={allUsers} postDetail={post} viewersId={userId}/>
                            )
                        : null
                    }
                </div>
            </div>
        </>
    )
}

export default NotificationDetail
