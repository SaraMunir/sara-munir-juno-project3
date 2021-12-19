import React, { useEffect, useState } from 'react';
import firebase from '../firebase';
import {  Link, useParams } from "react-router-dom";
import ReadPost from './ReadPost';
import {useFetchAllUser, useUserIdFromSessionId} from './hooks';
import NavBar from './NavBar';
import CommentCard from './CommentCard';


function NotificationDetail() {

    const [ userId, setUserId] = useState('')
    const { type } = useParams();
    const { typeId } = useParams();
    const { commentId } = useParams();
    const [allUsers] = useFetchAllUser()
    const [comments, setComments] = useState([])
    const sessionId = localStorage.sessionId;    
    const [viewersId] = useUserIdFromSessionId(sessionId)


    const [post, setPost] = useState({})
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
                // let dataArray = []
                // for(let key in data){
                //     const newObject = {...data[key], id: key}
                //     dataArray.push(newObject)
                // }
                setPost(response.val())
                // console.log(dataArray)
                setComments(data.comments)
                // dataArray.map(data=>{
                //     if(data.dataType ==="followersPost"){
                //         setPost(data)
                //     }
                // })
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
                
                <div className="allComments">
                    {
                        comments ?
                        comments.map(comment=>
                            <CommentCard  key={comment.id} comment={comment} allUsers={allUsers} postDetail={post} viewersId={userId}/>
                            // <div key={comment.id} className='notifDetail'>
                            //     {allUsers.map(user=>
                            //         user.id === comment.commenterId ? 
                            //         <div className='imageCntr'>
                            //             <Link to={`/userProfile/${user.fullName}/${user.id}`}>
                            //                 <img key={user.id} className="smallThmbNail" src={user.profileImg ? user.profileImg.imageUrl : 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png' } alt={`image of ${user.fullName}`} />
                            //             </Link>
                            //         </div>
                            //         : null
                            //     )}
                            //     <div className='commentItem'>
                            //         {allUsers.map(user=>
                            //             user.id === comment.commenterId ? 
                            //             <Link to={`/userProfile/${user.fullName}/${user.id}`}>
                            //                 <h4 key={user.id}> {user.fullName }   </h4>
                            //             </Link>
                            //             : null
                            //         )}
                            //         <p> {comment.comment} </p>
                            //     </div>
                            // </div>
                            )
                        : null
                    }
                </div>
            </div>
        </>
    )
}

export default NotificationDetail
