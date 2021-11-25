import {useEffect, useState} from 'react'
import LikeUnlike from './LikeUnlike';
import firebase from '../firebase';
import { v4 as uuidv4 } from 'uuid';


function ReadPost(props) {
    const [postTime, setPostTime] = useState({})
    const viewersId = localStorage.loggedUserId;
    const [comment, setComment] = useState('')
    const [allComment, setAllComment] = useState([])
    const [postDetail, setPostDetail] = useState({})

    const month= ["January","February","March","April","May","June","July", "August","September","October","November","December"];
    
    const handleCommentInput =(e)=>{
        setComment(e.target.value)
    }
    const postAComment=(e)=>{
        e.preventDefault()
        console.log(props.post);
        if (comment){
            // check if the post had been liked before or not
            if(postDetail.comments){
             // if there was a comment we have to copy the likes in a new array constant
                const newList = [...postDetail.comments];
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
                    postId: props.post.id
                } 
                const commentObj ={
                    comments:newList
                }
                newList.push(commentObject)
                firebase.database().ref(`/${postDetail.id}`).update(commentObj);
                setComment('')
                loadPostDetail()

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
                    postId: props.post.id
                } 
                const commentObj ={
                    comments:[
                        commentObject
                    ]
                }
                firebase.database().ref(`/${postDetail.id}`).update(commentObj);
                setComment('')
                loadPostDetail()
            }
        }
    }
    const loadAllComments =()=>{
        const dbRef = firebase.database().ref();
        let allUsers
        const dataArray = [];
        dbRef.orderByChild('dataType').equalTo("userAccounts").on('value', (response)=>{
            const data = response.val();
            for (let key in data) {
                // making sure to add the id inside the object as well.
                const newObject = {...data[key], id: key}
                    // then pushing the users in the users array. 
                dataArray.push(newObject)
            }
            allUsers= dataArray
        })
        const usersCommentsArray = []
        dataArray.forEach(object=>{
            console.log('object', object)
            allUsers.forEach(user=>{
                if(user.id === object.commenterId){
                    const commentorObj = {...object, 
                        commentObj: {
                        fullName : user.fullName,
                        profileImg: user.profileImg,
                        id: user.id
                    } }
                    usersCommentsArray.push(commentorObj)
                }
            })
        })
        dbRef.orderByChild('postId').equalTo(props.post.id).on('value', (response)=>{
            const data = response.val()
            const dataArray = [];
            for (let key in data) {
                // making sure to add the id inside the object as well.
                const newObje = {...data[key], id: key}
                    // then pushing the users in the users array. 
                dataArray.push(newObje)
            }
            console.log(dataArray)
            // sorting the array by posting order 
            const sortingComments = usersCommentsArray.sort((a,b)=>{
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
            setAllComment(sortingComments)
        })
    }
    const loadPostDetail = ()=>{
        const dbRef = firebase.database().ref();
        let allUsers
        const usersArray = [];
        // getting all users 
        dbRef.orderByChild('dataType').equalTo("userAccounts").on('value', (response)=>{
            const data = response.val();
            for (let key in data) {
                // making sure to add the id inside the object as well.
                const newObject = {...data[key], id: key}
                // then pushing the users in the users array. 
                usersArray.push(newObject)
            }
            // allUsers= dataArray
        })
        console.log('dataarray: ', usersArray)
        firebase.database().ref(`/${props.post.id}`).on('value', (response)=>{
            const data = response.val();
            let postData = {...data, id: props.post.id}
            setPostDetail(postData)
            const usersCommentsArray = []
            if(postData.comments){
                console.log(postData.comments)
                postData.comments.forEach(object=>{
                    usersArray.forEach(user=>{
                        if(user.id === object.commenterId){
                            // editing the comment obj to include the commentors image, name and url
                            const commentorObj = {...object, 
                                commentorObj: {
                                    fullName : user.fullName,
                                    profileImg: user.profileImg,
                                    id: user.id
                                } }
                                usersCommentsArray.push(commentorObj)
                            }
                        })
                    })
                }
                setAllComment(usersCommentsArray)
        })
    }
    useEffect(() => {
        loadPostDetail()
        // loadAllComments()
        const post = props.post
        if(post.timeStamp){
            setPostTime(post.timeStamp)
        }
    }, [])

    return (
        <div>
            <div className="postSection">
                <p>{props.post.posts}
                </p>
                {
                    props.post.dataType === "followersPost" ? 
                    <div className="postersCntr">
                        <img className="smallThmbNail" src={props.post.poster.profileImg.imageUrl } alt={`image of ${props.post.poster.fullName}`} />
                        <p>{props.post.poster.fullName }</p>
                    </div>
                    : null
                }
                <div className="row">
                    {
                    postTime == {} ? null
                    : 
                    <p className="postedTime">
                        {postTime.date} {month[postTime.month]}, {postTime.year} at {postTime.hours}:{postTime.minutes}
                    </p>
                    }
                    {/* unLikePost */}
                    <div className="row">
                        <div className="likeSection">
                            <LikeUnlike post={props.post} viewersId={viewersId}/>
                        </div>
                    </div>

                </div>

            </div>
            <hr className="lineBreak"/>
            <div className="commentSection">
                {
                    props.isPersonFollowingUser || props.post.userId === viewersId? 
                    <form className="commentInput" onSubmit={postAComment}>
                        <label htmlFor="commentInput" hidden>Leave a comment</label>
                        <input id="commentInput" type="text" placeholder="Leave a Comment" onChange={handleCommentInput} value={comment}/>
                        <button className={comment ? "postBtn" : "postBtn postBtnGrey" }>Post A Comment</button>
                    </form>
                    : null
                }
                <h4>comments</h4>
                <div className="allComments">
                    {allComment.length>0?
                    allComment.map(comment=>
                        <div key={comment.id} className="row">
                            <img className="smallThmbNail" src={comment.commentorObj.profileImg.imageUrl} alt="" />
                            <div key={comment.id} className="commentCard">
                                <h4>{comment.commentorObj.fullName}</h4>
                                <p>
                                {comment.comment}
                                </p>
                            </div>
                        </div>
                        )
                    : null    
                    }
                </div>
            </div>
        </div>
    )
}

export default ReadPost
