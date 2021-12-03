import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment'
function CalendarTest() {
    const [dateState, setDateState] = useState(new Date())
    const changeDate = (e) => {
        console.log(
            e
        )
        // setDateState(e)
    }
    // String: "Sample"
    const mark = [
        '29-11-2021',
        '30-11-2021',
        '03-12-2021',
        '10-12-2021',
        '20-12-2021',
        '28-12-2021',
    ]
    const renderingRunsArray = ({ date, view }) => {
        // console.log('date: ', moment(date).format("DD-MM-YYYY"))
        // console.log('view: ', view)
        let className = 'normalTile'
        mark.forEach(day=>{
            if(day === moment(date).format("DD-MM-YYYY")){
                console.log(
                    'this day is same'
                )
                className= 'normalTile myColor'
            } 
        })
        return className
    }
    const showContent =({ date, view })=>{
        let contentValue = ''
        mark.forEach(day=>{
            if(day === moment(date).format("DD-MM-YYYY")){
                console.log(
                    'this day is same'
                )
                contentValue= 'run days'
            } else {
                return null
            }
        })
        return contentValue
    }
    // ({ date, view }) => view === 'month' && date.getDay() === 3 ? 'saturday' : null
    
    return (
        <div className="calendarCntr">
            <Calendar
            onChange={changeDate}
            value={dateState}
            tileClassName={renderingRunsArray}
            tileContent ={showContent}
            />
        </div>
    )
}

export default CalendarTest
