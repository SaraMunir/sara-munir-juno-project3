import {useState, useEffect} from 'react'
import firebase from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import loadingIcon from './assets/Bars-1s-200px.gif'


function UploadChangeProPic(props) {
    const[imgObj, setImgObj]= useState({})
    const [uploadBtn, setUploadBtn] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [srcUrl, setSrcUrl]=useState('')
    const [urlAvailable, setUrlAvailable] = useState(false)
    // when uploading image
    const selectImg =  (e)=>{
        const file = e.target.files[0];
        // setting the file to imgObj. 
        setImgObj(file)
        // activating the upload btn only when the file is selected. 
        setUploadBtn(true)
    }
    // when selecting url
    const selectUrl = (e)=>{
        let value = e.target.value;
        console.log('value: ', value)
        setSrcUrl(value)
        setUrlAvailable(true)
        setUploadBtn(true)
    }
    const uploadUrl = ()=>{
        // setUploading(true)
        const object = {
            profileImg: {
                userId: props.user.id,
                imageUrl: srcUrl
            }
        }
        console.log('object: ', object)
        // adding img url to the database
        firebase.database().ref(`/${props.user.id}`).update(object)
        //  once successfull, the following functions are called. 
        setUploading(false)
        setSrcUrl('')
        setUrlAvailable(false)
        // turningoff the modal
        props.modalWindow()

    }
    const handleUploadImg = async (e)=>{
        if(urlAvailable){
            console.log('whats showing ')
            // first check if user previously had uploaded a photo before. if yes then we have to delete the old file and then update the data base
            console.log(props.user.profileImg )

            if (props.user.profileImg ){
                const imageObj = props.user.profileImg;
                if (imageObj.imageId){
                    setUploading(true)

                    // creating the object to add to the database
                    const object = {
                        profileImg: {
                            userId: props.user.id,
                            imageUrl: srcUrl
                        }
                    }
                    const storageRef = firebase.storage().ref('image').child(imageObj.imageId);
                    // deleting the old photo 
                    await storageRef.delete().then(() => {
                        // then delete data of the image from the data base which is the just the id 
                        firebase.database().ref(`/${props.user.id}`).child('profileImg').child('imageId').remove()
                    });
                    // adding img url to the database
                    firebase.database().ref(`/${props.user.id}`).update(object);
                    //  once successfull, the following functions are called. 
                    setUploading(false)
                    setSrcUrl('')
                    setUrlAvailable(false)
                    // turningoff the modal
                    props.modalWindow()
                    
                } else {
                    uploadUrl()
                }
                
            } else {
                uploadUrl()
            }



        }else {
            // providing each images a unique id
            const id = uuidv4();
            const file = imgObj;
            // creating reference for storage
            const imagesRef = firebase.storage().ref('image').child(id);
            // const fileRef = storageRef.child(file.name);
            if (props.user.profileImg ){
                // this part is when user has a profile photo but want to change it. 
                const imageObj = props.user.profileImg;

                // turn on loading icon 
                setUploading(true)
                // Check if the image has an image id, since the user might have just added an url instead of upload an image. 
                if(imageObj.imageId){
                    // first delete the old photo and then upload the new photo. 
                    const storageRef = firebase.storage().ref('image').child(imageObj.imageId);
                    await storageRef.delete().then(() => {
                    });
                    // then upload new image
                    uploadImage(imagesRef, file, id)
                } else {
                    // if no imageId 
                    uploadImage(imagesRef, file, id)
                }
                setUploading(false)
                props.modalWindow()
            } else {
                setUploading(true)
                // this part is at the begining when user did not have any profile photos
                await imagesRef.put(file).then(()=>{
                    console.log('upload file')
                })
                await imagesRef.getDownloadURL().then((url=>{
                    const object = {
                        profileImg: {
                            userId: props.user.id,
                            imageId: id,
                            imageUrl: url
                        }
                    }
                    // adding the object profileImg to the users data
                    firebase.database().ref(`/${props.user.id}`).update(object)
                }))
                // once the upload is done we turn off loading icon
                setUploading(false)
                props.modalWindow()
            }

        }
    }
    const uploadImage=async (imagesRef, file, id)=>{
        await imagesRef.put(file).then(()=>{})
        await imagesRef.getDownloadURL().then((url=>{
            const object = {
                profileImg: {
                    imageId: id,
                    imageUrl: url
                }
            }
            // adding the object profileImg to the users data
            firebase.database().ref(`/${props.user.id}`).update(object)
        }))
    }

    return (
        <>
        {
            uploading ?
            <>
                <h2>hold tight, we are uploading your image</h2>
                <img className="loadingIcon" src={loadingIcon} alt="loading icon" /> 
            </> :
            <>
                <img className='uploadPicThmb' src={props.user.profileImg ? props.user.profileImg.imageUrl :
                'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png'} alt="" />
                <form className="input-group mb-3" id='myCvrForm' role="form" >
                    <label className="custom-file-label" htmlFor="inputGroupFile02" hidden>Choose file</label>
                    <input 
                        type="file" 
                        name="myFile"
                        onChange={selectImg} id="inpFile"/>

                    <h3>or</h3>
                    <label htmlFor="url"> provide a url for your image</label>
                    <input type="text" id="srcUrl" onChange={selectUrl} value={srcUrl}/>

                </form>
                <button className={uploadBtn ? "postBtn" : "postBtn postBtnGrey"} disabled={!uploadBtn} onClick={handleUploadImg}>Upload</button> 
            </>
        }
        </>
    )
}

export default UploadChangeProPic
