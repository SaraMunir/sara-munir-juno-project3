import {useEffect, useState} from 'react'
import firebase from '../firebase';

function ReadPost(props) {
    const [ postObj, setPostObj] = useState({})
    useEffect(() => {
        const dbRef = firebase.database().ref();
        dbRef.child(props.postId).on('value', (response)=>{
            const data = response.val()
            console.log(data)
            setPostObj({...data, id: props.postId})
        })

    }, [])

    return (
        <div>
            {postObj.posts}
            {postObj.id}
            {props.postId}
        </div>
    )
}

export default ReadPost
