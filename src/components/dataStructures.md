const postObject ={
    postId: id,
    dataType: 'followersPost',
    userId: userId,
    posts: post.postText, 
    timeStamp: dateTime,
    postersId: visitor.id,
}

const postNotification = {
    dataType: 'notification',
    type: 'followersPost',
    userId: userId,
    posts: post.postText,
    timeStamp: dateTime,
    postersId: visitor.id,
    postId: id,
    read: false
}
const commentNotification = {
    dataType: 'notification',
    type: 'commentOnPost',
    commentId: id,
    commenterId: viewersId,
    comment: comment, 
    timeStamp: dateTime,
    postId: props.post.id,
    read: false, 
    postType: props.post.dataType,
    userId: props.post.userId,
    who: 'owner'

}
const commentNotificationForFollowers = {
    dataType: 'notification',
    type: 'commentOnPost',
    commentId: id,
    commenterId: viewersId,
    comment: comment, 
    timeStamp: dateTime,
    postId: props.post.id,
    read: false, 
    postType: props.post.dataType,
    userId: props.post.postersId,
    who: 'follower',
    wallOwner: props.post.userId,
}