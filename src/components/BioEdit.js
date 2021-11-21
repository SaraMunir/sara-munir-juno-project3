import { useState } from 'react'
import firebase from '../firebase';
import loadingIcon from './assets/Bars-1s-200px.gif'

function BioEdit(props) {
    const user = props.user;
    const [loading, setLoading] = useState(false);

    const [usersObj, setUsersObj] = useState({
        // this structure is in case user wants to add and update his infomation yet. 
        bio: user.bio ? user.bio :'no bio provided',
        birthday: user.birthday ? user.birthday :'',
        location: user.location ? user.location :'not provided yet',
        education: user.education ? user.education :'not provided yet',
        occupation: user.occupation ? user.occupation :'not provided yet'
    });

    const handleOnChange = (e)=>{
        const {id, value} = e.target;
        setUsersObj({...usersObj, [id]: value})
    }
    const handleBioSubmit = (e)=>{
        e.preventDefault();

        setLoading(true)
        setTimeout(() => {
            firebase.database().ref(`/${user.id}`).update(usersObj);
            props.modalWindow()
            setLoading(false)
        }, 1000);
    }
    return (
        <div>
            {
                loading ?
                <>
                    <h2>hold tight, we are updating your bio</h2>
                    <img className="loadingIcon" src={loadingIcon} alt="loading icon" /> 
                </> :
                <>
                    <h2>bio</h2>
                    <form action="" onSubmit={handleBioSubmit}>
                        <div className="inputCntr">
                            <label htmlFor="bio">bio (maximum 150 character) </label>
                            <input 
                            type="text"
                            id="bio"
                            maxLength="150"
                            placeholder="provide your bio, max 150 characters"
                            value={usersObj.bio} onChange={handleOnChange}
                            />
                        </div>
                        <div className="inputCntr">
                            <label htmlFor="birthday">birthday</label>
                            <input type="date" id="birthday" name="birthday"
                                value={usersObj.birthday} onChange={handleOnChange}></input>
                        </div>
                        <div className="inputCntr">
                            <label htmlFor="location">location</label>
                            <input 
                            type="text"
                            id="location"
                            value={usersObj.location} onChange={handleOnChange}
                            />
                        </div>
                        <div className="inputCntr">
                            <label htmlFor="education">education</label>
                            <input 
                            type="text"
                            id="education"
                            value={usersObj.education} onChange={handleOnChange}
                            />
                        </div>
                        <div className="inputCntr">
                            <label htmlFor="occupation">occupation</label>
                            <input 
                            type="text"
                            id="occupation"
                            value={usersObj.occupation} onChange={handleOnChange}
                            />
                        </div>
                        <button>submit</button>
                    </form>
                </>
            }
        </div>
    )
}

export default BioEdit
