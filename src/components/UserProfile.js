import React, { useEffect, useState } from 'react';
import firebase from '../firebase';
import {  useParams } from "react-router-dom";
import Profile from './Profile';
import PostCards from './PostCards';
import ReadPost from './ReadPost';
import NavBar from './NavBar';
import { Navigate, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

let selectedPostId;

function UserProfile(props) {
    let navigate = useNavigate();

    const loggedInd = localStorage.loggedInd;
    const sessionId = localStorage.sessionId;
    const [visitorId, setVisitorId] = useState('')
    const { userId } = useParams();
    const [user, setUser]= useState({});
    const [visitor, setVisitor]= useState({});
    const [usersPost, setUserPost]=useState([]);

    const [usersFriendsPost, setUsersFriendsPost] = useState({});

    const [homeModal, setHomeModal] = useState(false);
    const [readMore, setReadMore] = useState(false);
    const [isPersonFollowingUser, setIsPersonFollowingUser] = useState(false);
    const [usersFollowers,setUsersFollowers] = useState([])
    const [usersFollowings,setUsersFollowings] = useState([])

    const [usersThoughtPosts, setUsersThoughtPosts] = useState(true)
    const [usersFriendsPosts, setUsersFriendsPosts] = useState(false);
    const [postObject, setPostObject] = useState({})

    const id = uuidv4();
    const [post, setPost] = useState({
        postText: ''
    });
    const handleInputPost = (e)=>{
        const {id, value}= e.target
        setPost({...post, [id]: value})
    }
    const modalWindow = (type, id, obj)=>{
        setHomeModal(!homeModal)
        if (type === "readMore"){
            setReadMore(true)
            selectedPostId = id;
            setPostObject(obj)
        }
    }
    // function to post on wall. 
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
                postId: id,
                dataType: 'followersPost',
                userId: userId,
                posts: post.postText, 
                timeStamp: dateTime,
                postersId: visitor.id
            }
            const postNotification = {
                dataType: 'notification',
                type: 'followersPost',
                userId: userId,
                posts: post.postText,
                timeStamp: dateTime,
                postersId: visitor.id,
                postId: id,
                read: false
            }
            dbRef.push(postObject);
            dbRef.push(postNotification);
            setPost({postText: ''})
        }
    }
    const followUser = ()=>{
        // once clicked the person who is ffolloing will be added to the persons followers list as well as  to their own list of following

        // when the user did not have any follower initially
        if(!user.Followers){
            const followerObject = {
                Followers:[visitorId]
            }
            firebase.database().ref(`/${userId}`).update(followerObject)
            setIsPersonFollowingUser(true)
        } else {
            const userFollowers = [...user.Followers];
            userFollowers.push(visitorId)
            const followerObject = {
                Followers: userFollowers
            }
            firebase.database().ref(`/${userId}`).update(followerObject);
            setIsPersonFollowingUser(true)
        }
        // then adding the user to the visitors following list
        // similarly first check if the visitor has any following key in their data

        if(!visitor.Following){
            const followingObject = {
                Following:[userId]
            }
            firebase.database().ref(`/${visitor.id}`).update(followingObject)
        }else {
            const visitorsFollowings = [...visitor.Following];
            visitorsFollowings.push(userId)
            const followingObject = {
                Following: visitorsFollowings
            }
            firebase.database().ref(`/${visitor.id}`).update(followingObject)

        }
    }
    // unfollowing user 
    const unFollowUser=()=>{
        //removing the visitor from the users followers list
        const userFollowers = [...user.Followers];
        // removing the visitor's id from the users follower's list. 
        const filteredFollower = userFollowers.filter(follower=>{
            return follower !== visitorId
        })
        // updating users data on firebase database
        const followerObject = {
            Followers: filteredFollower
        }
        firebase.database().ref(`/${userId}`).update(followerObject);
        setIsPersonFollowingUser(false)

        // removing the user from the visitors list
        const visitorsFollowings = [...visitor.Following];
        // removing the user's id from the visitors following's list. 
        const filteredFollowerings = visitorsFollowings.filter(follower=>{
            return follower !== userId
        })
        // then update the data
        const followingObject = {
            Following: filteredFollowerings
        }
        firebase.database().ref(`/${visitor.id}`).update(followingObject)

    }
    // toggling between wall posts
    const toggleTabs= (tab)=>{
        // users Thoughts
        if (tab === 'myThoughts'){
            setUsersThoughtPosts(true);
            setUsersFriendsPosts(false);
        }
        // users Friends Thoughts
        if (tab === 'myFriendsThoughts'){
            setUsersFriendsPosts(true);
            setUsersThoughtPosts(false);
        }
    }

    // getting data for both users and the visitors
    useEffect(async () => {
        if(sessionId){
            let personVisitingId
            let personVisitingsEmail
            // getting the users data who's profile viewer is viewing. 
            let userData
            await firebase.database().ref(`/${userId}`).on('value', async(response)=>{
                const data = response.val();
                userData = {...data, id: userId}
                setUser({...data, id: userId})
                await firebase.database().ref(`/sessions/${sessionId}`).on('value', (response)=>{
                    const data2 = response.val();
                    let sessionData 
                    for (let key in data2) {
                        // making sure to add the id inside the object as well.
                        const newObject = {...data2[key]}
                            // then pushing the users in the users array. 
                            sessionData= newObject
                    }
                    setVisitorId(sessionData.userId)
                    personVisitingId=sessionData.userId
                    personVisitingsEmail=sessionData.emailAddress
                })
                if(data.Followers){
                    //'checking users followers list: 
                    data.Followers.map(follower=>{
                        if (follower === personVisitingId){
                            setIsPersonFollowingUser(true)
                        }
                    })
                }
                // getting the viewers data as well
                firebase.database().ref().orderByChild('emailAddress').equalTo(personVisitingsEmail).on('value', (response)=>{
                    const data = response.val();
                    const dataArray = []
                    for (let key in data) {
                        // making sure to add the id inside the object as well.
                        const newObject = {...data[key], id: key}
                            // then pushing the users in the users array. 
                        dataArray.push(newObject)
                    }
                    setVisitor(dataArray[0])
                })
            })



            // getting other users data to get the followers & followings objects.
            await firebase.database().ref().on('value', (response)=>{
                const data = response.val()
                const dataArray = []
                for (let key in data) {
                    // making sure to add the id inside the object as well.
                    const newObje = {...data[key], id: key}
                        // then pushing the users in the users array. 
                    dataArray.push(newObje)
                }
    
                // getting the posts data from the users followers
                const usersFriendsPostsArray = []
    
                dataArray.forEach(obj=>{
                    //  first get data that has the type of followersPost
                    if(obj.dataType ==='followersPost'){
                        // if the posts userid is equal to user's userid then push the object to the posts array
                        if(userId === obj.userId){
                            usersFriendsPostsArray.push(obj)
                        }
                    }
                })
                // addign the posters object to the array:
                const editedUsersFriendsPostsArray =[]
                usersFriendsPostsArray.forEach(friendsPost=>{
                    dataArray.forEach(other=>{
                        if(other.id === friendsPost.postersId){
                            const posterObjt = {...friendsPost, 
                                poster: {
                                fullName : other.fullName,
                                profileImg: other.profileImg,
                                id: other.id
                            } }
                            editedUsersFriendsPostsArray.push(posterObjt)
                        }
                    })
                })
    
    
                // filtering the users object to get only the followers list 
                const userFollowersArr = [];
                if(userData.Followers){
                    userData.Followers.forEach(person=>{
                        dataArray.forEach(other=>{
                            if(other.id === person){
                                userFollowersArr.push(other)
                            }
                        })
                    })
                }
                // sorting the array by posting order 
                const sortingFriendsPosts = editedUsersFriendsPostsArray.sort((a,b)=>{
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
                setUsersFriendsPost(sortingFriendsPosts)
                
                // filtering the users object to get only the followings list 
                const userFollowingArr = [];
                if(userData.Following){
                    userData.Following.forEach(person=>{
                        dataArray.forEach(other=>{
                            if(other.id === person){
                                userFollowingArr.push(other)
                            }
                        })
                    })
                }
                setUsersFollowers(userFollowersArr)
                setUsersFollowings(userFollowingArr)
            })
        }else {
            localStorage.clear();
            window.location.reload(false);
            navigate(`/`); 

        }
    }, [userId])

    // getting the users posts data's 
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
            const usersPost = postsArray.filter(post=>{
                return post.userId === userId
            })
                // sorting the array by posting order 
            const sortingUserssPosts = usersPost.sort((a,b)=>{
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
            setUserPost(sortingUserssPosts)
        })
    }, [userId])


    return (
        <>
        <NavBar userId={visitorId}/>

        {visitorId === userId ? <Navigate to='/Homepage' /> : null }
        { loggedInd === "false" ||  !loggedInd?  <Navigate to='/' /> : null }

        {/* <NavBar loggedInd={loggedInd} /> */}
        <section className="wrapper mainProfile">
            {
                homeModal?
                <div className="modalWindow">
                    <div className="modalWindowCntr">
                        <div className="row jstfyCntEnd">
                            {/* to close modal windo */}
                            <button className="modalCloseBtn" onClick={modalWindow}><i className="fas fa-2x fa-times"></i></button>
                        </div>
                        {readMore ? 
                        <ReadPost postId={selectedPostId} post={postObject} isPersonFollowingUser={isPersonFollowingUser} userId={visitorId}/> 
                        : null}
                    </div>
                </div> 
                : null
            }
            <aside>
                {isPersonFollowingUser? 
                <button className="followBtn" onClick={unFollowUser}>Unfollow</button> 
                : 
                <button className="followBtn" onClick={followUser}>Follow</button>
                }
                
                {user ? <Profile  user={user} modalWindow={modalWindow} profielType = {'visitor'} usersFollowers={usersFollowers}  usersFollowings={usersFollowings}/>  : null}
            </aside>
            <article className="wall">
            {
                isPersonFollowingUser? 
                <form className="card postForm" onSubmit={postOnUsersWalls}>
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
                </form> : 
                null 
            }
            <ul className="tabBar">
                <li><button className={usersThoughtPosts ? "tabActive" : "tab"} onClick={()=>toggleTabs('myThoughts')}>{user.fullName}'s Thoughts</button></li>
                <li><button className={usersFriendsPosts ? "tabActive" : "tab"} onClick={()=>toggleTabs('myFriendsThoughts')}>{user.fullName}'s  Followers thoughts</button></li>
            </ul>
            <div className="thoughtCntr">
            {
                usersThoughtPosts ?
                <div className="posts">
                    { usersPost.length>0 ?
                    usersPost.map(post=>
                        <PostCards key={post.id} visitorId={visitorId} post={post} modalWindow={modalWindow} userType={'visitor'}/>
                    )
                    : 
                    <div className="card">
                    <p>{user.fullName} has not shared any thoughts yet</p>
                    </div>
                    }
                </div> : ''
            }
            {
                usersFriendsPosts ?
                <div className="posts">
                    {
                    usersFriendsPost.length>0 ?
                    usersFriendsPost.map(post=>
                        <PostCards key={post.id} visitorId={visitorId} post={post} modalWindow={modalWindow} userType={'visitor'}/>
                    )
                    : 
                    <div className="card">
                    <p>No Posts yet</p>
                    </div>
                    }
                </div> : ''
            }
            </div>
            </article>
        </section>
        </>

    )
}


export default UserProfile
