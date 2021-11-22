import React, { useEffect, useState } from 'react';
import firebase from '../firebase';
import {  useParams } from "react-router-dom";
import Profile from './Profile';
import PostCards from './PostCards';
import ReadPost from './ReadPost';

let selectedPostId;

function UserProfile(props) {
    const { userName } = useParams();
    const { userId } = useParams();
    const [user, setUser]= useState({});
    // const [profielType, setProfileType]=useState('visitor');
    const [usersPost, setUserPost]=useState([]);
    const [homeModal, setHomeModal] = useState(false)
    const [readMore, setReadMore] = useState(false)

    const [post, setPost] = useState({
        postText: ''
    });

    const handleInputPost = (e)=>{
        const {id, value}= e.target
        setPost({...post, [id]: value})
    }


    const modalWindow = (type, id)=>{
        setHomeModal(!homeModal)
        if (type === "readMore"){
            setReadMore(true)
            // setBioScreen(false)
            // setUploadPic(false)
            selectedPostId = id
        }
    }
    const postOnUsersWalls=(e)=>{
        e.preventDefault();
        if(post.postText){
            const dbRef = firebase.database().ref();
            const currentDate = new Date();
            const dateTime ={ 
                date: currentDate.getDate(),
                month: currentDate.getMonth(),
                year: currentDate.getFullYear(),
                hours: currentDate.getHours(), 
                minutes: currentDate.getMinutes(),
                }

                //  creating the post as an object with users id so that i can pull data based on the id
            const postObject ={
                dataType: 'userPost',
                userId: userId,
                posts: post.postText, 
                timeStamp: dateTime,
            }
            dbRef.push(postObject);
            setPost({postText: ''})
        }


    }

    useEffect(() => {
        firebase.database().ref(`/${userId}`).on('value', (response)=>{
            const data = response.val();
            // console.log(data)
            setUser(data)
            
        })
    }, [])
    useEffect(() => {
        const dbRef = firebase.database().ref();
        dbRef.orderByChild('dataType').equalTo('userPost').on('value', (response)=>{
            const data = response.val();
            const postsArray = [];
            for (let key in data) {
                // making sure to add the id inside the object as well.
                const userObject = {...data[key], id: key}
                // then pushing the users in the users array. 
                postsArray.push(userObject)
            }
            // setUsers(postsArray)
            console.log(postsArray)
            const usersPost = postsArray.filter(post=>{
                return post.userId === userId
            })
            console.log(usersPost)
            setUserPost(usersPost)
        })

    }, [])

    return (
        <section className="wrapper row">
            {
                homeModal?
                <div className="modalWindow">
                    <div className="modalWindowCntr">
                        <div className="row jstfyCntEnd">
                            <button className="modalCloseBtn" onClick={modalWindow}><i className="fas fa-2x fa-times"></i></button>
                        </div>
                        {readMore ? <ReadPost postId={selectedPostId}/> : null}
                    </div>
                </div> 
                : null
            }
            <aside>
                <button className="followBtn">Follow</button>
                {user ? <Profile  user={user} modalWindow={modalWindow} profielType = {'visitor'}/>  : null}
            </aside>
            <article>
                {/* <form className="card postForm" onSubmit={postOnUsersWalls}>
                    <label htmlFor="postText" hidden>post your thought</label>
                    <textarea 
                    id="postText" 
                    name="post" rows="4" cols="50"
                    onChange={handleInputPost}
                    value={post.postText}
                    placeholder={`post on ${user.fullName}'s wall'`}
                    >
                    </textarea>
                    <div className="row jstfyCntEnd">
                        <button className={post.postText ? "postBtn" : "postBtn postBtnGrey" }>post</button>
                    </div>
                </form> */}
                <div className="posts">
                    { usersPost.length>0 ?
                    usersPost.map(post=>
                        <PostCards key={post.id} post={post} modalWindow={modalWindow} userType={'visitor'}/>
                    )
                    : 
                    <div className="card">
                        <p>{userName} has not posted any thoughts yet</p>
                        <div className="likeStuf">
                            <button><i className="far fa-heart"></i></button>
                        </div>
                    </div>
                    }
                </div>
            </article>

        </section>
    )
}

export default UserProfile
