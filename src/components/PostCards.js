import {useEffect, useState} from 'react'
import firebase from '../firebase.js'
import LikeUnlike from './LikeUnlike'
function PostCards(props) {
    const [postLiked, setPostLiked] = useState(false)
    const [postTime, setPostTime] = useState({})
    const month= ["January","February","March","April","May","June","July",
        "August","September","October","November","December"];
    const deletePost=(id)=>{
        const dbRef = firebase.database().ref();
        dbRef.child(id).remove()
    }
    useEffect(() => {
        const post = props.post
        // checking if the post is like by the user or not
        if(post.likes){
            post.likes.map(like=>{
                if(like === props.visitorId){
                    setPostLiked(true)
                }else {
                    setPostLiked(false)
                }
            })
        } else {
            setPostLiked(false)
        }
        // rendering time of the post
        if(post.timeStamp){
            setPostTime(post.timeStamp)
        }
    }, [props.likePost, props.unLikePost])
    return (
        <div className="card">
            {
                props.userType === 'user' ?
            <div className="row jstfyCntEnd">
                <button className="deleteBtn" onClick={()=>deletePost(props.post.id)}><i className="fas fa-times"></i></button>
            </div> 
            : null
            }
            {
            postTime == {} ? null
            : 
            <p className="postedTime">
                {postTime.date} {month[postTime.month]}, {postTime.year} at {postTime.hours}:{postTime.minutes}
            </p> 
                }
            {/* printing posts based on the length of the posts. */}
            {props.post.posts.length > 149 ? 
            <p className="postContent">
                {props.post.posts.slice(0, 150)} . . .
                <button className="readMore" onClick={()=>props.modalWindow('readMore', props.post.id, props.post)}>read more</button>
            </p>
            :<p  className="postContent">{props.post.posts}</p>}

            {/* redering  followers posts when selected */}
            {
                props.post.dataType === "followersPost" ? 
                <div className="postersCntr">
                    <img className="smallThmbNail" src={props.post.poster.profileImg ? props.post.poster.profileImg.imageUrl :'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png' } alt={`image of ${props.post.poster.fullName}`} />
                    <p>{props.post.poster.fullName }</p>
                </div>
                : null
            }
            {/* unLikePost */}
            <div className="row">
                <div className="likeSection" >
                    <LikeUnlike post={props.post} viewersId={props.visitorId}/>
                    <div className="row">
                        <button className="comment" onClick={()=>props.modalWindow('readMore', props.post.id, props.post)}>
                            <i className="far fa-comment"></i> 
                        </button>
                        <p className="likeNum"> {props.post.comments?props.post.comments.length:null} </p>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostCards
