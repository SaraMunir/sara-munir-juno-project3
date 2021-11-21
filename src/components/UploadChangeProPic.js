import {useState, useEffect} from 'react'
import firebase from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import loadingIcon from './assets/Bars-1s-200px.gif'


function UploadChangeProPic(props) {
    const[imgObj, setImgObj]= useState({})
    const [uploadBtn, setUploadBtn] = useState(false)

    const selectImg =  (e)=>{
        console.log(imgObj)
        const file = e.target.files[0];
        console.log('file: ', file)
        setImgObj(file)
        setUploadBtn(true)
    }
    const uploadImg = async (e)=>{
        const id = uuidv4();
        const file = imgObj;
        // const storageRef = firebase.storage().ref();
        const imagesRef = firebase.storage().ref('image').child(id);
        // const fileRef = storageRef.child(file.name);
        if (props.user.profileImg ){
            // this part is when user has a profile photo but want to change it. 
            const imageObj = props.user.profileImg;
            // first delete the old photo and then upload the new photo. 
            console.log('1')
            const storageRef = firebase.storage().ref('image').child(imageObj.imageId);
            console.log(2)
            await storageRef.delete().then(() => {
            });
            console.log(2)
            await imagesRef.put(file).then(()=>{
                console.log('upload file')
            })
            await imagesRef.getDownloadURL().then((url=>{
                const object = {
                    profileImg: {
                        imageId: id,
                        imageUrl: url
                    }
                }
                // adding the object profileImg to the users data
                firebase.database().ref(`/${props.userId}`).update(object)
            }))
            console.log('there is no image')
            props.modalWindow()

        } else {
            // this part is at the begining when user did not have any profile photos
            await imagesRef.put(file).then(()=>{
                console.log('upload file')
            })
            await imagesRef.getDownloadURL().then((url=>{
                const object = {
                    profileImg: {
                        dataType: 'profilePhoto',
                        userId: props.userId,
                        imageId: id,
                        imageUrl: url
                    }
                }
                // adding the object profileImg to the users data
                firebase.database().ref(`/${props.userId}`).update(object)
            }))


            props.modalWindow()
        }
        }

    return (
        <>
            <img className='uploadPicThmb' src={props.user.profileImg ? props.user.profileImg.imageUrl :
            'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png'} alt="" />
            <form className="input-group mb-3" id='myCvrForm' role="form" >
                <input 
                    type="file" 
                    name="myFile"
                    onChange={selectImg} id="inpFile"/>
                <label className="custom-file-label" htmlFor="inputGroupFile02" hidden>Choose file</label>
            </form>
            
            <button className="postBtn" disabled={!uploadBtn} onClick={uploadImg}>Upload</button> 
        </>
    )
}

export default UploadChangeProPic
