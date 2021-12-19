import React, { useEffect, useState } from 'react'
import {  Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import firebase from '../firebase';
import {useUserIdFromSessionId} from './hooks'
import moment from 'moment'

function CommentCard({comment, allUsers, postDetail, viewersId}) {
    const [ userId, setUserId] = useState('')
    const [ commentReplies, setCommentReplies] = useState([])

    const sessionId = localStorage.sessionId;
    const [commentLiked, setCommentLiked] = useState(false)
    const [datePosted, setDatePosted] = useState('')

    const [ showReplyInput, setShowReplyInputOn ] =useState({commentId:'', show: false})
    const [ showReplies, setShowReplies ] =useState({replyId:'', show: false})
    const [ reply, setReply ] = useState('')
    const replyToComment=()=>{
        if(showReplyInput.show===false){
            setShowReplyInputOn({commentId:comment.id, show:true})
        }else {
            setShowReplyInputOn({commentId:'', show:false})
        }
    }
    const showreply=(commentid)=> {
        if(showReplies.show===false){
            setShowReplies({replyId:commentid, show: true})
        }else {
            setShowReplies({replyId:'', show: false})
        }
    }
    const likeComment=(e, commentId)=>{
        e.preventDefault()
        postDetail.comments.forEach(comment=>{
            if(comment.id === commentId){
                // console.log(comment)
                if(comment.likes){
                    let newLikeArr = [...comment.likes]
                    newLikeArr.push(viewersId)
                    comment.likes = newLikeArr
                    setCommentLiked(true)
                }else {
                    // creating the propertie of likes
                    comment['likes']=[viewersId]
                    setCommentLiked(true)
                }
            }
            console.log(comment)
        })
        firebase.database().ref(`/${postDetail.id}`).update(postDetail)
    }
    const unLikeComment=(e, commentId)=>{
        console.log('this is to check comment likes', comment.like)
        e.preventDefault()
        postDetail.comments.forEach(comment=>{
            if(comment.id === commentId){
                // console.log(comment)
                if(comment.likes){
                    const filteredLikeArr=comment.likes.filter(like=>like!== viewersId) 
                    console.log("filteredLikeArr", filteredLikeArr)
                    comment.likes=filteredLikeArr
                }
                console.log(comment)
                firebase.database().ref(`/${postDetail.id}`).update(postDetail)
                setCommentLiked(false)
            }
        })
    }

    const handleInput=(e)=>{
        setReply(e.target.value)
    }
    const postReply=(e, commentId)=>{
        e.preventDefault();
        const dbRef = firebase.database().ref();

        const id = uuidv4();
        console.log(postDetail)
        postDetail.comments.forEach(comment=>{
            if(comment.id === commentId){
                // console.log(comment)
                if(comment.replies){
                    const newRepliesArr = [...comment.replies]
                    console.log('is there any replies?')
                    const currentDate = new Date();
                    const dateTime ={
                        date: currentDate.getDate(),
                        month: currentDate.getMonth(),
                        year: currentDate.getFullYear(),
                        hours: currentDate.getHours(), 
                        minutes: currentDate.getMinutes(),
                        }
                    const replyObj ={
                        id:  id,
                        replierId: viewersId,
                        reply: reply, 
                        timeStamp: dateTime,
                        replyId: postDetail.id
                    }
                    if(viewersId === comment.commenterId){
                        
                    }else {
                        const replyNotificaiton = {
                            dataType: 'notification',
                            type: 'replyOnPost',
                            replierId: viewersId,
                            reply: reply,
                            read: false,
                            timeStamp: dateTime,
                            postId: postDetail.id,
                            whichComment: comment.id,
                            userId: comment.commenterId,
                        }
                        console.log('replyNotificaiotn')
                        dbRef.push(replyNotificaiton);
                    }
                    newRepliesArr.push(replyObj)
                    comment.replies = newRepliesArr
                }else {
                    // creating time stamp for te reply
                    const currentDate = new Date();
                    const dateTime ={
                        date: currentDate.getDate(),
                        month: currentDate.getMonth(),
                        year: currentDate.getFullYear(),
                        hours: currentDate.getHours(), 
                        minutes: currentDate.getMinutes(),
                        }
                    const replyObj ={
                        id:  id,
                        replierId: viewersId,
                        reply: reply, 
                        timeStamp: dateTime,
                        replyId: postDetail.id
                    }
                    if(viewersId === comment.commenterId){
                        
                    }else {
                        const replyNotificaiton = {
                            dataType: 'notification',
                            type: 'replyOnPost',
                            replierId: viewersId,
                            reply: reply,
                            read: false,
                            timeStamp: dateTime,
                            postId: postDetail.id,
                            whichComment: comment.id,
                            userId: comment.commenterId,
                        }
                        console.log('replyNotificaiotn')
                        dbRef.push(replyNotificaiton);
                    }
                    comment['replies'] = [replyObj]
                }
            }
        })
        firebase.database().ref(`/${postDetail.id}`).update(postDetail)
        setShowReplyInputOn({commentId:'', show: false})
        setReply('')
    }
    useEffect(() => {
        console.log('is it running?')
        // converting time to moment
        const d = new Date(`${comment.timeStamp.year}/${comment.timeStamp.month}/${comment.timeStamp.date} ${comment.timeStamp.hours}:${comment.timeStamp.minutes}:00`);
        // console.log(moment(d).format('MMMM Do YYYY, h:mm:ss a'))
        setDatePosted(d);
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
        if(comment.likes){
            //has the comment be liked by viewer
            comment.likes.forEach(like=>{
                console.log(like)
                if(like===ownersId){
                    setCommentLiked(true)
                }else {
                    setCommentLiked(false)
                }
            })
        }
        if(comment.replies){
            console.log('here is the replies', comment.replies)
            setCommentReplies(comment.replies)
        }
    }, [comment])
    return (
        <div key={comment.id}>
            <div >
                {/* image of commentor */}
                <div className='notifDetail'>
                    {allUsers.map(user=>
                        user.id === comment.commenterId ? 
                        <div key={`usersImg${user.id}`} className='imageCntr'>
                            <Link to={`/userProfile/${user.fullName}/${user.id}`}>
                                <img key={user.id} className="smallThmbNail" src={user.profileImg ? user.profileImg.imageUrl : 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png' } alt={`image of ${user.fullName}`} />
                            </Link>
                        </div>
                        : null
                    )}
                    <div className='commentItem'>
                        <div className="commentsLikeCntr"><i className="far fa-heart"></i> &nbsp; {comment.likes ? comment.likes.length : 0}</div>
                        {/* commentor name */}
                        {allUsers.map(user=>
                            user.id === comment.commenterId ? 
                            <Link  key={`commentOn${comment.id}`} to={`/userProfile/${user.fullName}/${user.id}`}>
                                <h4 key={user.id}> {user.fullName }   </h4>
                            </Link>
                            : null
                        )}
                        {/* comment */}
                        <p> {comment.comment} </p>
                        <div className='row'>
                            <button className='commentBtns' onClick={replyToComment}>reply</button>
                            {commentLiked ?
                            <button className='commentBtns' onClick={(e)=>unLikeComment(e, comment.id)}>unlike</button>
                            :
                            <button className='commentBtns' onClick={(e)=>likeComment(e, comment.id)}>like</button>
                            }
                            <p className='postedTime'> 
                                {moment(datePosted).format('MMMM Do YYYY, h:mm:ss a')}
                            </p>
                        </div>
                    </div>

                </div>
                <div className="replies">
                    {commentReplies.length>0?
                    showReplies.show===false ?
                    <button className='replyShowBtna' onClick={()=>showreply(comment.id)}>{commentReplies.length} replies</button> 
                    :<button className='replyShowBtna' onClick={()=>showreply(comment.id)}>Hide replies</button> 
                    :null }
                    {
                        showReplies.replyId ===comment.id && showReplies.show ===true ?
                        comment.replies ?
                        comment.replies.map(reply=>
                            <div className='notifDetail'>
                                {allUsers.map(user=>
                                    user.id === reply.replierId ? 
                                    <div key={`usersImg${user.id}`} className='imageCntr'>
                                        <Link to={`/userProfile/${user.fullName}/${user.id}`}>
                                            <img key={user.id} className="smallThmbNail" src={user.profileImg ? user.profileImg.imageUrl : 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png' } alt={`image of ${user.fullName}`} />
                                        </Link>
                                    </div>
                                    : null
                                )}
                                <div className="commentItem">
                                {allUsers.map(user=>
                                    user.id === reply.replierId  ? 
                                    <Link  key={`commentOn${comment.id}`} to={`/userProfile/${user.fullName}/${user.id}`}>
                                        <h4 key={user.id}> {user.fullName }   </h4>
                                    </Link>
                                    : null
                                )}
                                <p>{reply.reply}</p>
                                </div>
                            </div>
                        )
                        : null
                        :null
                    }
                    {
                        showReplyInput.commentId === comment.id && showReplyInput.show===true ?
                        <div className='notifDetail'>
                            {allUsers.map(user=>
                                user.id === userId? 
                                <div key={`usersImg${user.id}`} className='imageCntr'>
                                    <Link to={`/userProfile/${user.fullName}/${user.id}`}>
                                        <img key={user.id} className="smallThmbNail" src={user.profileImg ? user.profileImg.imageUrl : 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png' } alt={`image of ${user.fullName}`} />
                                    </Link>
                                </div>
                                : null
                            )}
                            <form className='commentItem' onSubmit={(e)=>postReply(e,comment.id) }>
                                <label htmlFor="reply"></label>
                                <input type="text" value={reply} onChange={handleInput}/>
                            </form>
                        </div>
                        : null
                    }
                </div>
            </div>
        </div>
    )
}

export default CommentCard
