import {useState, useEffect} from 'react';
import { Navigate  } from 'react-router-dom';
import firebase from '../firebase';
import PostCards from './PostCards';
import './styles/HomePage.css'
import BioEdit from './BioEdit';
import ReadPost from './ReadPost';
import UploadChangeProPic from './UploadChangeProPic';
import Profile from './Profile';

function Homepage() {
    const usersEmail = localStorage.emailAddress;
    const loggedInd = localStorage.loggedInd;
    const usersId = localStorage.loggedUserId;

    
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
    // 
    // const [testLike, setTestLikes] = useState(false)

    /**
     * ⚠️ need this code for later reference
        const likePost = (postObj)=>{
            console.log('clicked in homepage')
            // check if the post had been liked before or not
            if(postObj.likes){
                // if liked we have to copy the likes in a new array constant
                const newList = [...postObj.likes];
                // add the visitors id to the like array
                newList.push(user.id)
                // create an object with the new array
                const likeObj ={
                    likes:newList
                }
                setTestLikes(true)
                // update firebase database. 
                firebase.database().ref(`/${postObj.id}`).update(likeObj);
            }else {
                // since the post was not liked before we are creating a property of likes with
                const likeObj ={
                    likes:[
                        user.id
                    ]
                }
                setTestLikes(true)
                firebase.database().ref(`/${postObj.id}`).update(likeObj);
            }
        }
        const unLikePost = (postObj)=>{
            console.log('is it unliked?')
            // remove the visitors id from the from the array of the liked ids. 
            if(postObj.likes){
                const unlikedArray = postObj.likes.filter(like=>{
                    return like !== user.id
                })
                // creating an object with the rest of the array and then posting it in the database
                const likeObj ={
                    likes:unlikedArray
                }
                setTestLikes(false)
                // console.log('is it unliked?:', testLike)
                firebase.database().ref(`/${postObj.id}`).update(likeObj);
            } else {
                setTestLikes(false)
            }
        }
     */
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
        const dbRef = firebase.database().ref();
        dbRef.on('value', (response)=>{
            const data = response.val()
            const dataArray = []
            for (let key in data) {
                // making sure to add the id inside the object as well.
                const newObje = {...data[key], id: key}
                    // then pushing the users in the users array. 
                dataArray.push(newObje)
            }
            // console.log(dataArray) this is working 
            // getting data only for the user from the email address that's stored in the local storage
            let userData 
            dataArray.forEach(user=>{
                if(user.emailAddress === usersEmail){
                    userId =user.id
                    localStorage.setItem("loggedUserId",  user.id);
                    userData=user
                    setUser(user);
                }
            })
            
            const usersPostArray = []
            // getting data for users posts
            dataArray.forEach(obj=>{
                //  first get data that has the type of userPost
                if(obj.dataType ==='userPost'){
                    // is the posts userid is equal to user's userid then push the object to the posts array
                    if(userId === obj.userId){
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
                    if(userId === obj.userId){
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
        })
    }, [])
    return (
        <>
        <section className="wrapper mainProfile">
            {homeModal?
            <div className="modalWindow">
                <div className="modalWindowCntr">
                    <div className="row jstfyCntEnd">
                        <button className="modalCloseBtn" onClick={modalWindow}><i className="fas fa-2x fa-times"></i></button>
                    </div>
                    {bioScreen ? <BioEdit user = {user} modalWindow={modalWindow}/> : null}
                    {readMore ? <ReadPost postId={selectedPostId} post = {postObject} user={user}/> : null}
                    {uploadPic ? <UploadChangeProPic userId={userId} user={user}  modalWindow={modalWindow}/> : null}
                </div>
            </div> 
            : null
            }
            { loggedInd === "false" ||  !loggedInd?  <Navigate to='/Welcome'/> :  null}
            <aside>
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
                                <PostCards key={post.id} post={post} modalWindow={modalWindow} userType={'user'}  />
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
                                <PostCards key={post.id} post={post} modalWindow={modalWindow} userType={'user'} />
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
