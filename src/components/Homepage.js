import {useState, useEffect} from 'react';
import { Navigate  } from 'react-router-dom';
import firebase from '../firebase';
// import userDefaultImage from './assets/user.png'
import userDefaultImage from './assets/IMG_2900_lowRes.jpg'
import PostCards from './PostCards';
import './styles/HomePage.css'
const usersEmail = localStorage.emailAddress;
const loggedInd = localStorage.loggedInd;
let userId = ''
function Homepage() {
    const [user, setUser] = useState({})
    const [usersPost, setUsersPost] = useState({});
    const [post, setPost] = useState({
        postText: ''
    });
    const handleInputPost = (e)=>{
        const {id, value}= e.target
        setPost({...post, [id]: value})
    }
    // submitting the post
    const postPost = (e)=>{
        e.preventDefault();
        const dbRef = firebase.database().ref();
        // creating time stamps:
        let currentDate = new Date();
        const dateTime ={ 
            date: currentDate.getDate(),
            month: currentDate.getMonth()+1,
            year: currentDate.getFullYear(),
            hours: currentDate.getHours(), 
            minutes: currentDate.getMinutes(),
            }
        //  creating the post as an object with users id so that i can pull data based on the id
        const postObject ={
            userId: userId,
            posts: post.postText, 
            timeStamp: dateTime
        }
        console.log()
        dbRef.push(postObject);
        setPost({postText: ''})
    }

    useEffect(() => {
        const dbRef = firebase.database().ref();
        dbRef.on('value', (response)=>{
            const data = response.val()
            const dataArray = []
            for (let key in data) {
                const newObje = {...data[key], id: key}
                dataArray.push(newObje)
            }
            const usersPostArray = []
            // getting data only for the user
            dataArray.forEach(user=>{
                if(user.emailAddress === usersEmail){
                    userId = user.id
                    setUser(user);
                }
            })
            dataArray.forEach(obj=>{
                if(userId === obj.userId){
                    console.log('in homepage: ', obj)
                    usersPostArray.push(obj)
                }
            })
            setUsersPost(usersPostArray)
        })
    }, [])
    return (
        <section className="wrapper row">
            { loggedInd === "false" ||  !loggedInd?  <Navigate to='/Welcome'/> :  null}
            <aside>
                <div className="profile">
                    <div className="profileImg">
                        <img src={userDefaultImage} alt="default avatar" />
                        <h2 className="userName">{user.fullName}</h2>
                    </div>
                    <div className="card">
                        <button className="editBtn"><i className="fas fa-user-edit"></i></button>
                        <h2>Bio</h2>
                        <hr />
                        <p className="bioText">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Numquam voluptates fugiat quas, quidem explicabo quia accusantium illum corrupti quod omnis ab aliquam, expedita animi, alias in tenetur totam officiis quisquam!</p>
                        <div className="bioContainer">
                            <i className="fas fa-birthday-cake"></i>
                            <p>Birthday Not Provided</p>
                        </div>
                        <div className="bioContainer">
                            <i className="fas fa-map-marked-alt"></i>
                            <p>Location Not Provided</p>
                        </div>
                        <div className="bioContainer">
                            <i className="fas fa-user-graduate"></i>
                            <p>Education Not Provided</p>
                        </div>
                        <div className="bioContainer">
                            <i className="fas fa-briefcase"></i>
                            <p>Job Not Provided</p>
                        </div>
                    </div>
                    <div className="card">
                        <h2>Followers</h2>
                        <hr />
                        <div className='friendsGalleryThumb'>
                            <img src="https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="a women" />
                            <img src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" alt="a women" />
                            <img src="https://images.pexels.com/photos/3992656/pexels-photo-3992656.png?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="a women" />
                            <img src="https://media.gettyimages.com/photos/choose-positivity-every-morning-picture-id640307210?s=612x612" alt="a women" />
                            <img src="https://media.istockphoto.com/photos/smiling-indian-man-looking-at-camera-picture-id1270067126?k=20&m=1270067126&s=612x612&w=0&h=ZMo10u07vCX6EWJbVp27c7jnnXM2z-VXLd-4maGePqc=" alt="a women" />
                            <img src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="a women" />
                            <img src="https://image.shutterstock.com/image-photo/portrait-mature-businessman-wearing-glasses-260nw-738242395.jpg" alt="a women" />
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTglCWa5kuVgNTrXD2NxCFZ82apQ-8UhJMVFg&usqp=CAU" alt="a women" />
                        </div>
                    </div>
                    <div className="card">
                        <h2>Following</h2>
                        <hr />
                        <div className='friendsGalleryThumb'>
                            <img src="https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="a women" />
                            <img src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" alt="a women" />
                            <img src="https://images.pexels.com/photos/3992656/pexels-photo-3992656.png?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="a women" />
                            <img src="https://media.gettyimages.com/photos/choose-positivity-every-morning-picture-id640307210?s=612x612" alt="a women" />
                            <img src="https://media.istockphoto.com/photos/smiling-indian-man-looking-at-camera-picture-id1270067126?k=20&m=1270067126&s=612x612&w=0&h=ZMo10u07vCX6EWJbVp27c7jnnXM2z-VXLd-4maGePqc=" alt="a women" />
                            <img src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="a women" />
                            <img src="https://image.shutterstock.com/image-photo/portrait-mature-businessman-wearing-glasses-260nw-738242395.jpg" alt="a women" />
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTglCWa5kuVgNTrXD2NxCFZ82apQ-8UhJMVFg&usqp=CAU" alt="a women" />
                        </div>
                    </div>
                </div>
            </aside>
            {/* <Wall user={user} userId={userId} usersPost={usersPost}/> */}
            <article className="wall">
            <form className="card postForm" onSubmit={postPost}>
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
                    <button className="postBtn">post</button>
                </div>
            </form>
            <div className="posts">
                
                { usersPost.length>0 ?
                usersPost.map(post=>
                    <PostCards post={post}/>
                ) : <div className="card">
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
