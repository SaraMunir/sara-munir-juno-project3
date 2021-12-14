import firebase from '../firebase';
import {useState, useEffect} from 'react';


export function useFetchAllUser(){
    const [allUsers, setAllUsers]=useState([])

    useEffect(()=>{
        firebase.database().ref().orderByChild('dataType').equalTo('userAccounts').on('value', (response)=>{
            const data = response.val();
            const dataArray = []
            for (let key in data) {
                // making sure to add the id inside the object as well.
                const newObject = {...data[key], id: key}
                    // then pushing the users in the users array. 
                dataArray.push(newObject)
            }
            setAllUsers(dataArray)
        })
    }, [])
    return [allUsers]
}
export function useNotifications(userId){
    const [notifications, setNotifications]=useState([])
    useEffect(() => {
        // getting the viewers data as well
        firebase.database().ref().orderByChild('dataType').equalTo('notification').on('value', (response)=>{
            const data = response.val();

            const dataArray = []
            for (let key in data) {
                // making sure to add the id inside the object as well.
                const newObject = {...data[key], id: key}
                    // then pushing the users in the users array. 
                dataArray.push(newObject)
            }
            // const usersNotifications
            const usersNotification = dataArray.filter(notifi=>{
                return notifi.userId === userId && notifi.read === false
            })
            const sortingArrays = usersNotification.sort((a,b)=>{
                let A = a.timeStamp
                let B = b.timeStamp
                if(A.year > B.year) return -1
                if(A.year < B.year) return 1
                if(A.month > B.month) return -1
                if(A.month < B.month) return 1
                if(A.date > B.date) return -1
                if(A.date < B.date) return 1
                if(A.hours > B.hours) return -1
                if(A.hours < B.hours) return 1
                if(A.minutes > B.minutes) return -1
                if(A.minutes < B.minutes) return 1
            })
            setNotifications(sortingArrays)
        })
    }, [])
    return [notifications]
}
export function useUserIdFromSessionId(sessionId){
    const [mainUserId, setMainUserId] = useState();
    useEffect(()=>{
         // getting the viewers data as well
        let ownersId
        firebase.database().ref(`/sessions/${sessionId}`).on('value', (response)=>{
            const data = response.val();
            let sessionData 
            for (let key in data) {
                // making sure to add the id inside the object as well.
                const newObject = {...data[key]}
                    // then pushing the users in the users array. 
                    sessionData= newObject
            }
            setMainUserId(sessionData.userId)
            ownersId=sessionData.userId
            console.log('sessionData', sessionData)
        })
    }, [])
    return [mainUserId]
}