import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// import { Link, useHistory } from "react-router-dom";

import firebase from '../firebase.js'

function SearchBar() {
    let navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    // const [searchList, setSearchList] = useState([])
    const [searchInput, setSearchInput] = useState('');
    const [viewSearch, setViewSearch] = useState(false)
    const handleSearchInput =(e)=> {
        // console.log(e);
        // storing all the users input and then lowercasing it
        const newInput = e.target.value.toLowerCase();
        setSearchInput(newInput);
        if(newInput.length>0){
            const newList = users.filter(user=>{
                // get the name of the users and lower case it to match the users input. 

                return user.fullName.toLowerCase().indexOf(newInput) == 0
            })
            setFilteredUsers(newList)
        } else {
            setFilteredUsers([])
        }
    }
    const viewSearchInput=(e)=>{
        setViewSearch(!viewSearch);
    }
    const navigateTo=(userName, userId)=>{
        viewSearchInput()
        setFilteredUsers([]);
        setSearchInput('')
        navigate(`/userProfile/${userName}/${userId}`);
        document.location.reload(true);
    }

    useEffect(() => {
        // load all the accounts that has data type of user account
        const dbRef = firebase.database().ref();
        dbRef.orderByChild('dataType').equalTo('userAccounts').on('value', (response)=>{
            const data = response.val();
            const usersArray = [];
            for (let key in data) {
                // making sure to add the id inside the object as well.
                const userObject = {...data[key], id: key}
                // then pushing the users in the users array. 
                usersArray.push(userObject)
            }
            setUsers(usersArray)
            // console.log(usersArray)
        })
    }, [])
    return (
        <div>
            <form action="" className={viewSearch ?'searchInput searchWidth': 'searchInput'} id="searchForm">
                <input 
                type="text"
                id="searchInput"
                value={searchInput}
                onChange={handleSearchInput}
                onClick={viewSearchInput}
                />
                <button><i className="fas fa-search"></i></button>
            </form>
            {
                filteredUsers.length>0 ?
                <ul className="searchCntr">
                    {filteredUsers.map(user=>
                        <Link onClick={()=>navigateTo(user.fullName,user.id)}  key={user.id} to={`/userProfile/${user.fullName}/${user.id}`} >
                            <li className="searchLink">
                                <img className="searchThmb" src={user.profileImg.imageUrl} alt="" />
                                {user.fullName}
                            </li>
                        </Link>
                    )}
                </ul>
                : null
            }
        </div>
    )
}

export default SearchBar
