import React, { useEffect, useState } from 'react';

import {Link} from 'react-router-dom'



function Profile(props) {
    const usersFollowers = props.usersFollowers
    const usersFollowings = props.usersFollowings
    const user = props.user
    const modalWindow = props.modalWindow
    const profileType = props.profileType

    return (
        <div className="profile">
            <div className="profileImg">
                {/* depending on the person viewing, if its own profile, enabling the editing ability*/}
            {profileType === 'user' ? 
                <div className="profileImgCntr" onClick={()=>modalWindow('editProPic')}>
                    <button className="editBtn" ><i className="fas fa-camera-retro"></i></button> 
                    <img src={
                        user.profileImg ? user.profileImg.imageUrl :
                        'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png'} alt={user.profileImg ? `profile photo of ${user.fullName}` : 'default image'}/>
                </div> 
                :
                <div className="profileImgCntr">
                    <img src={
                    user.profileImg ? user.profileImg.imageUrl :
                    'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png'} alt={user.profileImg ? `profile photo of ${user.fullName}` : 'default image'}/>
                </div>
                }
                <h2 className="userName">{user.fullName}</h2>
            </div>
            <div className="card">
                {profileType === 'user' ? 
                <button className="editBtn" onClick={()=>modalWindow('editBio')}><i className="fas fa-user-edit"></i></button> : null }
                <h2>Bio</h2>
                <hr />
                <p className="bioText">{user.bio?user.bio : 'no bio provided yet'}</p>
                <div className="bioContainer">
                    <i className="fas fa-birthday-cake"></i>
                    <p>{user.birthday ? user.birthday : 'no birthday provided yet'}</p>
                </div>
                <div className="bioContainer">
                    <i className="fas fa-map-marked-alt"></i>
                    <p>{user.location ? user.location : 'no location provided yet'}</p>
                </div>
                <div className="bioContainer">
                    <i className="fas fa-user-graduate"></i>
                    <p>{user.education ? user.education : 'no education provided yet'}</p>
                </div>
                <div className="bioContainer">
                    <i className="fas fa-briefcase"></i>
                    <p>{user.occupation ? user.occupation : 'no occupation provided yet'}</p>
                </div>
            </div>
            <div className="card">
                <h2>Followers</h2>
                <hr />

                <div className='friendsGalleryThumb'>
                    {usersFollowers.length >0 ?
                        usersFollowers.map(follwer=>

                            <Link to={`/userProfile/${follwer.fullName}/${follwer.id}`} >
                            <img title={follwer.fullName} key={follwer.id} src={follwer.profileImg ? follwer.profileImg.imageUrl : 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png'} alt={follwer.fullName} />
                            </Link>
                            )
                        :
                        <h4>No followers yet</h4>
                    }
                </div>
            </div>
            <div className="card">
                <h2>Following</h2>
                <hr />
                <div className='friendsGalleryThumb'>
                    {usersFollowings.length >0 ?
                        usersFollowings.map(follwer=>
                            <Link to={`/userProfile/${follwer.fullName}/${follwer.id}`} >
                            <img title={follwer.fullName} key={follwer.id} src={follwer.profileImg ? follwer.profileImg.imageUrl : 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png'} alt={follwer.fullName} />
                            </Link>
                            )
                        :
                        <h4>Not following anyone</h4>
                    }

                </div>
            </div>
        </div>
    )
}

export default Profile
