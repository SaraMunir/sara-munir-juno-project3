import {useEffect, useState} from 'react'
function PostCards(props) {
    const[postTime, setPostTime] = useState({})
    const month= ["January","February","March","April","May","June","July",
        "August","September","October","November","December"];
    const daysInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    useEffect(() => {
        const post = props.post
        if(post.timeStamp){
            setPostTime(post.timeStamp)
        }
    }, [])
    return (
        <div className="card">
            <p>{props.post.posts}</p>
                {
                    postTime == {} ? null
            : 
            <p className="postedTime">
                {postTime.date} {month[postTime.month]}, {postTime.year} at {postTime.hours}:{postTime.minutes}
            </p> 
                }
            <div className="likeStuf">
                <button><i className="far fa-heart"></i></button>
            </div>
        </div>
    )
}

export default PostCards
