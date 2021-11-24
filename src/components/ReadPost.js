import {useEffect, useState} from 'react'
import LikedSection from './LikedSection';

function ReadPost(props) {
    const [postLiked, setPostLiked] = useState(false)
    const [postTime, setPostTime] = useState({})
    const viewersId = localStorage.loggedUserId;
    const month= ["January","February","March","April","May","June","July",
        "August","September","October","November","December"];

    useEffect(() => {
        // checking if the post is like by the user or not
        const post = props.post
        if(post.likes){
            post.likes.map(like=>{
                if(like === viewersId){
                    setPostLiked(true)
                }else {
                    setPostLiked(false)
                }
            })
        } else {
            setPostLiked(false)
        }
        // rendering time of the post
        if(post.timeStamp){
            setPostTime(post.timeStamp)
        }
    }, [props.likePost, props.unLikePost, props.post])

    return (
        <div>
            <div className="postSection">
                <p>{props.post.posts}
                </p>
                {
                    props.post.dataType === "followersPost" ? 
                    <div className="postersCntr">
                        <img className="smallThmbNail" src={props.post.poster.profileImg.imageUrl } alt={`image of ${props.post.poster.fullName}`} />
                        <p>{props.post.poster.fullName }</p>
                    </div>
                    : null
                }
                <div className="row">
                    {
                    postTime == {} ? null
                    : 
                    <p className="postedTime">
                        {postTime.date} {month[postTime.month]}, {postTime.year} at {postTime.hours}:{postTime.minutes}
                    </p>
                    }
                    {/* unLikePost */}
                    <div className="row">
                        <div className="likeSection">
                        {postLiked ?
                    <div className="row">
                        <button className="likeBtnActive" 
                        onClick={()=>props.unLikePost(props.post)}
                        ><i className="fas fa-heart"></i></button>
                        <p className="likeNum">
                        {props.post.likes ? props.post.likes.length : null}
                        </p>
                    </div>
                    : 
                    <div className="row">
                        <button className="likeBtn" onClick={(e)=>props.likePost(props.post)}><i className="far fa-heart"></i></button>
                        <p className="likeNum">
                        {props.post.likes  ? props.post.likes.length : null}
                        </p>
                    </div>
                    }
                        </div>
                    </div>

                </div>

            </div>
            <hr className="lineBreak"/>
            <div className="commentSection">
                {
                    props.isPersonFollowingUser ? 
                    <div className="commentInput">
                        <label htmlFor="commentInput" hidden>Leave a comment</label>
                        <input id="commentInput" type="text" placeholder="Leave a Comment"/> 
                    </div>
                    : null
                }
                <div>
                    <h4>comments</h4>
                    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Delectus facilis quasi voluptas quas unde illo eius reiciendis itaque earum explicabo aliquam est eveniet officiis ullam laudantium molestiae hic, similique quibusdam.</p>
                    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Delectus facilis quasi voluptas quas unde illo eius reiciendis itaque earum explicabo aliquam est eveniet officiis ullam laudantium molestiae hic, similique quibusdam.</p>
                    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Delectus facilis quasi voluptas quas unde illo eius reiciendis itaque earum explicabo aliquam est eveniet officiis ullam laudantium molestiae hic, similique quibusdam.</p>
                    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Delectus facilis quasi voluptas quas unde illo eius reiciendis itaque earum explicabo aliquam est eveniet officiis ullam laudantium molestiae hic, similique quibusdam.</p>
                </div>
            </div>
        </div>
    )
}

export default ReadPost
