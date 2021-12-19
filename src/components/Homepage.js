import {useState, useEffect} from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import firebase from '../firebase';
import PostCards from './PostCards';
import './styles/HomePage.css'
import BioEdit from './BioEdit';
import ReadPost from './ReadPost';
import UploadChangeProPic from './UploadChangeProPic';
import Profile from './Profile';
import NavBar from './NavBar';


function Homepage() {
    let navigate = useNavigate();

    const [myId, setMyId]= useState('')
    const loggedInd = localStorage.loggedInd;
    const sessionId = localStorage.sessionId;
    let userId
    // 🚨 ⚠️ im keeping the below comment because i tried to use the state to replace user id but it doesnt work as useState does not work in this case and userId woked. 
    // 🚨 ⚠️ const [userId, setUserId] =useState('')

    let selectedPostId;
    const [user, setUser] = useState({})
    const [usersPost, setUsersPost] = useState({});
    const [friendsPost, setFriendsPost] = useState({});
    const [post, setPost] = useState({
        postText: ''
    });
    const [homeModal, setHomeModal] = useState(false)
    const [bioScreen, setBioScreen] = useState(false)
    const [readMore, setReadMore] = useState(false)
    const [uploadPic, setUploadPic] = useState(false)
    const [myThoughtPosts, setMyThoughtPosts] = useState(true)
    const [myFriendsPosts, setMyFriendsPosts] = useState(false)
    const [usersFollowers,setUsersFollowers] = useState([])
    const [usersFollowings,setUsersFollowings] = useState([])
    const [postObject, setPostObject] = useState({})
    const handleInputPost = (e)=>{
        const {id, value}= e.target
        setPost({...post, [id]: value})
    }
    // submitting the post
    const postMyThought = (e)=>{
        e.preventDefault();
        if(post.postText){
            const dbRef = firebase.database().ref();
            // creating time stamps:
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
                userId: user.id,
                posts: post.postText, 
                timeStamp: dateTime,
            }
            dbRef.push(postObject);
            setPost({postText: ''})
        }
    }
    // oppening modal window
    const modalWindow =(type, id, obj)=>{
        setHomeModal(!homeModal)
        if (type === "editBio"){
            setBioScreen(true)
            setReadMore(false)
            setUploadPic(false)
        }
        if (type === "readMore"){
            setReadMore(true)
            setBioScreen(false)
            setUploadPic(false)
            setPostObject(obj)
        }
        if (type === "editProPic"){
            setUploadPic(true)
            setReadMore(false)
            setBioScreen(false)
            selectedPostId = id
        }
    }
    const toggleTabs= (tab)=>{
        if (tab === 'myThoughts'){
            setMyThoughtPosts(true);
            setMyFriendsPosts(false);
        }
        if (tab === 'myFriendsThoughts'){
            setMyFriendsPosts(true);
            setMyThoughtPosts(false);
        }
    }
    useEffect(() => {
        if(sessionId){
            let ownersId
            let ownersEmail
            let emailObj
    
            let sessionData 
            const dbRef = firebase.database().ref();
            firebase.database().ref(`/sessions/${sessionId}`).on('value', (response)=>{
                const data = response.val();
                for (let key in data) {
                    // making sure to add the id inside the object as well.
                    const newObject = {...data[key], sessionKeyId: key}
                        // then pushing the users in the users array. 
                        sessionData = newObject
                }
                // setUserId(sessionData.userId)
                // setMyId(sessionData.userId)
                // ownersId=sessionData.userId
                ownersEmail = sessionData.emailAddress;
            })
            dbRef.on('value', (response)=>{
                const data = response.val()
                const dataArray = []
                for (let key in data) {
                    // making sure to add the id inside the object as well.
                    const newObje = {...data[key], id: key}
                        // then pushing the users in the users array. 
                    dataArray.push(newObje)
                }
                // getting data only for the user from the email address that's stored in the local storage
                let userData;
                dataArray.forEach(user=>{
                    if (user.dataType === "userAccounts"){
                        if(user.emailAddress === ownersEmail){
                            userData=user
                            setUser(user);
                            setMyId(user.id)
                            ownersId = user.id
                            emailObj= {userId: user.id}
                        }
                    }
                })
                
                const usersPostArray = []
                // getting data for users posts
                dataArray.forEach(obj=>{
                    //  first get data that has the type of userPost
                    if(obj.dataType ==='userPost'){
                        // is the posts userid is equal to user's userid then push the object to the posts array
                        if(ownersId === obj.userId){
                            usersPostArray.push(obj)
                        }
                    }
                })
                // sorting the array by posting order 
                const sortedArr = usersPostArray.sort((a,b)=>{
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
                setUsersPost(sortedArr)
                // getting the posts data from the users followers
                const usersFriendsPostsArray = []
                dataArray.forEach(obj=>{
                    //  first get data that has the type of followersPost
                    if(obj.dataType ==='followersPost'){
                        // if the posts userid is equal to user's userid then push the object to the posts array
                        if(ownersId === obj.userId){
                            usersFriendsPostsArray.push(obj)
                        }
                    }
                })
                // addign the posters object to the array:
                const editedUsersFriendsPostsArray =[]
                usersFriendsPostsArray.forEach(friendsPost=>{
                    // console.log('posts: ', friendsPost)
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
    
                setFriendsPost(sortingFriendsPosts)
    
                // getting data for the followers. 
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
                
                // getting data for the followings. 
                const userFollowingArr = [];
                if(userData.Following){
                    userData.Following.forEach(person=>{
                        dataArray.forEach(other=>{
                            if(other.id === person){
                                userFollowingArr.push(other)
                            }
                        })
                    })
                };
                setUsersFollowers(userFollowersArr);
                setUsersFollowings(userFollowingArr);
                if(!sessionData.userId){
                    console.log('did it run?')
                    firebase.database().ref(`/sessions/${sessionId}/${sessionData.sessionKeyId}`).update(emailObj)
                }
            })
            
        } else {
            console.log('no session id found')
            localStorage.clear();
            window.location.reload(false);
            navigate(`/`); 
        }
    }, [])
    return (
        <>
            <NavBar userId = {myId}/>
            <section className="wrapper mainProfile">
                {homeModal?
                <div className="modalWindow">
                    <div className="modalWindowCntr">
                        <div className="row jstfyCntEnd">
                            <button className="modalCloseBtn" onClick={modalWindow}><i className="fas fa-2x fa-times"></i></button>
                        </div>
                        {bioScreen ? <BioEdit user = {user} modalWindow={modalWindow}/> : null}
                        {readMore ? <ReadPost postId={selectedPostId} post = {postObject} user={user}/> : null}
                        {uploadPic ? <UploadChangeProPic userId={myId} user={user}  modalWindow={modalWindow}/> : null}
                    </div>
                </div> 
                : null
                }
                { loggedInd === "false" ||  !loggedInd?  <Navigate to='/Welcome'/> :  null}
                <aside>
                {userId}
                    <Profile user={user} modalWindow={modalWindow} profileType = {'user'} usersFollowers={usersFollowers} usersFollowings={usersFollowings}/>
                </aside>
                {/* <Wall user={user} userId={userId} usersPost={usersPost}/> */}
                <article className="wall">

                    {/* posting users thought input */}
                    <form className="card postForm" onSubmit={postMyThought}>
                        <label htmlFor="postText" hidden>post your thought</label>
                        <textarea 
                        id="postText" 
                        name="post" rows="4" cols="50"
                        onChange={handleInputPost}
                        value={post.postText}
                        placeholder="Share your thoughts"
                        >
                        </textarea>
                        <div className="row jstfyCntEnd">
                            <button className={post.postText ? "postBtn" : "postBtn postBtnGrey" }>post</button>
                        </div>
                    </form>
                    {/* rendering all the posts from users and followers */}
                    <ul className="tabBar">
                        <li>
                            <button className={myThoughtPosts ? "tabActive" : "tab"} onClick={()=>toggleTabs('myThoughts')}>My Thoughts</button></li>
                        <li><button className={myFriendsPosts ? "tabActive" : "tab"} onClick={()=>toggleTabs('myFriendsThoughts')}>My Followers thoughts</button></li>
                    </ul>
                    <div className="thoughtCntr">
                        {
                            myThoughtPosts ?
                            <div className="posts">
                                { usersPost.length>0 ?
                                usersPost.map(post=>
                                    <PostCards key={post.id} post={post} modalWindow={modalWindow} userType={'user'} visitorId={myId}/>
                                )
                                : 
                                <div className="card">
                                <p>Share your first post</p>
                                    <div className="likeStuf">
                                        <button><i className="far fa-heart"></i></button>
                                    </div>
                                </div>
                                }
                            </div> : ''
                        }
                        {
                            myFriendsPosts ?
                            <div className="posts">
                                {
                                friendsPost.length>0 ?
                                friendsPost.map(post=>
                                    <PostCards key={post.id} post={post} modalWindow={modalWindow} userType={'user'} visitorId={myId} />
                                )
                                : 
                                <div className="card">
                                <p>No Posts yet</p>
                                    <div className="likeStuf">
                                        <button><i className="far fa-heart"></i></button>
                                    </div>
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

export default Homepage
