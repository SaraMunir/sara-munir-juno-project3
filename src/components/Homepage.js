import {useState, useEffect} from 'react';
import { Navigate  } from 'react-router-dom';
import firebase from '../firebase';
import PostCards from './PostCards';
import './styles/HomePage.css'
import BioEdit from './BioEdit';
import ReadPost from './ReadPost';
import UploadChangeProPic from './UploadChangeProPic';
import Profile from './Profile';
const usersEmail = localStorage.emailAddress;
const loggedInd = localStorage.loggedInd;
let userId = '';
let selectedPostId;

function Homepage() {
    const [user, setUser] = useState({})
    const [usersPost, setUsersPost] = useState({});
    const [post, setPost] = useState({
        postText: ''
    });
    const [homeModal, setHomeModal] = useState(false)
    const [bioScreen, setBioScreen] = useState(false)
    const [readMore, setReadMore] = useState(false)
    const [uploadPic, setUploadPic] = useState(false)
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
                userId: userId,
                posts: post.postText, 
                timeStamp: dateTime,
            }
            dbRef.push(postObject);
            setPost({postText: ''})

        }
    }
    // oppening modal window
    const modalWindow =(type, id)=>{
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
            selectedPostId = id
        }
        if (type === "editProPic"){
            setUploadPic(true)
            setReadMore(false)
            setBioScreen(false)
            selectedPostId = id
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
            // getting data only for the user from the email address that's stored in the local storage
            dataArray.forEach(user=>{
                if(user.emailAddress === usersEmail){
                    userId = user.id
                    localStorage.setItem("loggedUserId",  user.id);
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
            // console.log(usersPostArray)
            // the sort the array by posting order 
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
        })
        
        
    }, [])
    return (
        <section className="wrapper row">
            {homeModal?
            <div className="modalWindow">
                <div className="modalWindowCntr">
                    <div className="row jstfyCntEnd">
                        <button className="modalCloseBtn" onClick={modalWindow}><i className="fas fa-2x fa-times"></i></button>
                    </div>
                    {bioScreen ? <BioEdit user = {user} modalWindow={modalWindow}/> : null}
                    {readMore ? <ReadPost postId={selectedPostId}/> : null}
                    {uploadPic ? <UploadChangeProPic userId={userId} user={user}  modalWindow={modalWindow}/> : null}
                </div>
            </div> 
            : null
            }
            { loggedInd === "false" ||  !loggedInd?  <Navigate to='/Welcome'/> :  null}
            <aside>
                <Profile user={user} modalWindow={modalWindow} profielType = {'user'}/>
            </aside>
            {/* <Wall user={user} userId={userId} usersPost={usersPost}/> */}
            <article className="wall">
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
                <div className="posts">
                    { usersPost.length>0 ?
                    usersPost.map(post=>
                        <PostCards key={post.id} post={post} modalWindow={modalWindow} userType={'user'}/>
                    )
                    : 
                    <div className="card">
                    <p>Share your first post</p>
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

export default Homepage
