import React from 'react'

function LikedSection(props) {
    console.log(props.testLike)
    return (
        <div>
            {props.postLiked || props.testLike ?
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
            {props.testLike}
        </div>
    )
}

export default LikedSection
