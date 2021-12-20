import React, { useEffect, useState } from 'react';
import firebase from '../firebase';
import FriendCard from './FriendCard';
import {useFetchAllUser} from './hooks';
import {  useParams } from "react-router-dom";


import NavBar from './NavBar'

function Followers() {
    const sessionId = localStorage.sessionId;    
    // const [ userId, setUserId] = useState('');
    const [ userFollowers, setUserFollowers] = useState([]);
    const [ userFollowings, setUserFollowings] = useState([]);
    const [allUsers] = useFetchAllUser()
    const [usersFollowers, setUsersFollowers] = useState(true)
    const [usersFollowings, setUsersFollowings] = useState(false);
    const { userId } = useParams();
    const [userName, setUserName]=useState('')


    const toggleTabs= (tab)=>{
        // users Thoughts
        if (tab === 'followers'){
            setUsersFollowers(true);
            setUsersFollowings(false);
        }
        // users Friends Thoughts
        if (tab === 'followings'){
            setUsersFollowings(true);
            setUsersFollowers(false);
        }
    }
    const handleFollowersChange = (e)=>{
        const {id, value} = e.target;
        if(value === "AtoZ"){
            const newArr =userFollowers.sort((a,b)=>{
                return a.fullName >b.fullName ? 1 : -1
            })
            setUserFollowers([...newArr])
        }
        if(value === "ZtoA"){
            const newArr =userFollowers.sort((a,b)=>{
                return a.fullName >b.fullName ? -1 : 1
            })
            setUserFollowers([...newArr])
        }
    }
    const handleFollowingsChange = (e)=>{
        const {id, value} = e.target;
        if(value === "AtoZ"){
                const newArr =userFollowings.sort((a,b)=>{
                return a.fullName > b.fullName ? 1 : -1
            })
            setUserFollowings([...newArr])
        }
        if(value === "ZtoA"){
            const newArr =userFollowings.sort((a,b)=>{
                return a.fullName > b.fullName ? -1 : 1
            })
            setUserFollowings([...newArr])
        }
    }
    useEffect(() => {
        let allUser = []
        firebase.database().ref().orderByChild('dataType').equalTo('userAccounts').on('value', (response)=>{
            const data = response.val();
            const dataArray = []
            for (let key in data) {
                // making sure to add the id inside the object as well.
                const newObject = {...data[key], id: key}
                    // then pushing the users in the users array. 
                dataArray.push(newObject)
                allUser.push(newObject)
            }

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
                // setUserId(sessionData.userId)
                // ownersId=sessionData.userId
                // getting users data as well
                let userFollwersArr=[]
                let userFollwingssArr=[]
                firebase.database().ref(`/${userId}`).on('value', (response)=>{
                    const userData = response.val();
                    setUserName(userData.fullName)
                    userData.Followers.forEach(follower=>{
                        allUser.forEach(user=>{
                            if(follower===user.id){
                                userFollwersArr.push(user)
                            } 
                            
                        })
                    })
                    userData.Following.forEach(follower=>{
                        allUser.forEach(user=>{
                            if(follower===user.id){
                                userFollwingssArr.push(user)
                            } 
                        })
                    })

                    setUserFollowers(userFollwersArr)
                    
                    setUserFollowings(userFollwingssArr)
                })
            })
        })
    }, [])
    return (
        <>
            <NavBar userId={userId}/>
            <section className='allFollowers'>
                <h3>{userName.toUpperCase()}'s followers list</h3>
                <ul className="tabBar">
                    <li><button className={usersFollowers ? "tabActive" : "tab"} onClick={()=>toggleTabs('followers')}>followers List {userFollowers.length>0?userFollowers.length: null}</button></li>
                    <li><button className={usersFollowings ? "tabActive" : "tab"} onClick={()=>toggleTabs('followings')}>followings List {userFollowings.length>0?userFollowings.length: null}</button></li>
                </ul>
                <div className="followersSection">
                    {
                        usersFollowers ?
                        <>
                            <form>
                                <label htmlFor="sort" hidden></label>
                                <select name="sort" id="usersFollowers" onChange={handleFollowersChange} defaultValue="AtoZ">
                                    <option value="AtoZ" hidden>A to Z</option>
                                    <option value="AtoZ">A to Z</option>
                                    <option value="ZtoA">Z to A</option>
                                </select>
                            </form>
                            <div className='friendCardCntr'>
                                {
                                    userFollowers.length>0 ?
                                    userFollowers.map(follower=>
                                        <FriendCard key={follower.id} allUsers={allUsers} follower={follower}/>
                                        )
                                    : null
                                }
                            </div>
                        </>
                        :null
                    }
                    {
                        usersFollowings ?
                        <>
                            <form>
                                <label htmlFor="sorting" hidden></label>
                                <select name="sorting" id="usersFollowings" onChange={handleFollowingsChange} defaultValue="AtoZ">
                                    <option value="AtoZ" hidden>A to Z</option>
                                    <option value="AtoZ">A to Z</option>
                                    <option value="ZtoA">Z to A</option>
                                </select>
                            </form>
                            <div className='friendCardCntr'>
                                {
                                    userFollowings.length>0 ?
                                    userFollowings.map(follower=>
                                            <FriendCard  key={follower.id} allUsers={allUsers} follower={follower}/>
                                        )
                                    : null
                                }
                            </div>
                        </>
                        :null
                    }
                </div>
            </section>

        </>
    )
}

export default Followers
