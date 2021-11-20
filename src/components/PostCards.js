import {useEffect} from 'react'

function PostCards(props) {
    const month= ["January","February","March","April","May","June","July",
        "August","September","October","November","December"];
    useEffect(() => {
        console.log(props.post)
        const post = props.post
        /* 
        date: 19
        hours: 19
        minutes: 16
        month: 11
        year: 2021
        */
        if(post.timeStamp){
            console.log('')
        }

    }, [])
    return (
        <div className="card">
            <p>{props.post.posts}</p>
            <div className="likeStuf">
                <button><i className="far fa-heart"></i></button>
            </div>
        </div>
    )
}

export default PostCards
