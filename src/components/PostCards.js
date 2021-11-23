import {useEffect, useState} from 'react'
import firebase from '../firebase.js'

function PostCards(props) {
    const[postTime, setPostTime] = useState({})
    const month= ["January","February","March","April","May","June","July",
        "August","September","October","November","December"];
    const deletePost=(id)=>{
        // console.log(id)
        const dbRef = firebase.database().ref();
        const something= dbRef.child(id).remove()
        // console.log("something: ", something)
    }
    const likePost=(id)=>{
        console.log('id')
    }

    useEffect(() => {
        // rendering time of the post
        const post = props.post
        if(post.timeStamp){
            setPostTime(post.timeStamp)
        }
    }, [])
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
                <button className="readMore" onClick={()=>props.modalWindow('readMore', props.post.id)}>read more</button>
            </p>
            :<p  className="postContent">{props.post.posts}</p>}

            {/* redering posted time */}
            {
                props.post.dataType === "followersPost" ? 
                <div className="postersCntr">
                    <img className="smallThmbNail" src={props.post.poster.profileImg.imageUrl } alt={`image of ${props.post.poster.fullName}`} />
                    <p>{props.post.poster.fullName }</p>
                </div>
                : null
            }

            <div className="likeStuf">
                <button className="likeBtn" onClick={()=>likePost(props.post.id)}><i className="far fa-heart"></i></button>
            </div>
        </div>
    )
}

export default PostCards
