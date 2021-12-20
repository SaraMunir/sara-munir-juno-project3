import React, {useState, useEffect} from 'react'
import firebase from '../firebase';

function LikeUnlike(props) {
    const sessionId = localStorage.sessionId;    
    const [ userId, setUserId] = useState('');


    const [postLiked, setPostLiked] = useState(false)
    const [postDetail, setPostDetail] = useState({})
    const likingPost = ()=>{
        // check if the post had been liked before or not
        if(postDetail.likes){
            // if liked we have to copy the likes in a new array constant
            const newList = [...postDetail.likes];
            // add the visitors id to the like array
            newList.push(props.viewersId)
            // create an object with the new array
            const likeObj ={
                likes:newList
            }
            // update firebase database. 
            firebase.database().ref(`/${postDetail.id}`).update(likeObj);
            loadPostDetail()
            setPostLiked(true)
        }else {
            // since the post was not liked before we are creating a property of likes with
            const likeObj ={
                likes:[
                    props.viewersId
                ]
            }
            firebase.database().ref(`/${postDetail.id}`).update(likeObj);
            loadPostDetail()
            setPostLiked(true)
        }
    }
    const unLikingPost = ()=>{
        if(postDetail.likes){
            // remove the visitors id from the from the array of the liked ids. 
            const unlikedArray = postDetail.likes.filter(like=>{
                return like !== props.viewersId
            })
            // creating an object with the rest of the array and then posting it in the database
            const likeObj ={
                likes:unlikedArray
            }
            // console.log('is it unliked?:', testLike)
            firebase.database().ref(`/${postDetail.id}`).update(likeObj);
            loadPostDetail()
            setPostLiked(false)
        }
    }
    const loadPostDetail = (viewersId)=>{
        firebase.database().ref(`/${props.post.id}`).on('value', (response)=>{
            const data = response.val();
            let postData = {...data, id: props.post.id}
            setPostDetail(postData)
            if(postData.likes){
                //'checking users followers list: 
                postData.likes.forEach(like=>{
                    if (like === viewersId){
                        setPostLiked(true)
                    }
                })
            }
        })
    }
    useEffect(() => {
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
            
                    loadPostDetail(ownersId)
                    // checking if the post is like by the user or not
        })

    }, [])
    return (
    <div>
        {postLiked === true ?
        <div className="row">
            <button className="likeBtnActive" 
            onClick={()=>unLikingPost()}
            ><i className="fas fa-heart"></i></button>
            <p className="likeNum">
            {postDetail.likes ? postDetail.likes.length : null}
            </p>
        </div>
        :  null}
        { postLiked === true ? null :
        <div className="row">
            <button className="likeBtn" onClick={()=>likingPost()}><i className="far fa-heart"></i></button>
            <p className="likeNum">
            {postDetail.likes  ? postDetail.likes.length : null}
            </p>
        </div>
        }
    </div>
    )
}

export default LikeUnlike
