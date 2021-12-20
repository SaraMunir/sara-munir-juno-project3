import React from 'react'
import { Link } from 'react-router-dom'

function FriendCard({allUsers, follower}) {
    return (
        <div className="friendCard ">
        {
                <Link to={`/userProfile/${follower.fullName}/${follower.id}`}>
                    <div key={follower.id} className='row'>
                        <img className="largeThmbNail" src={follower.profileImg ? follower.profileImg.imageUrl : 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png' } alt={`image of ${follower.fullName}`} />
                        <div className='friendCardTxt'>
                            <h4>{follower.fullName}</h4>
                            <p>{follower.occupation ==="not provided yet" ? '': follower.occupation }</p>
                            <p>{follower.location ==="not provided yet" ? '': follower.location}</p>
                        </div>
                    </div>
                </Link>
        } 
    </div>
    )
}

export default FriendCard
