import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import './calendar.css'
import DndCalendar from './dndCalendar'
import { Calendar, Views, momentLocalizer, DateLocalizer } from 'react-big-calendar'
import moment from 'moment'
import EventCalendar from './vkurkoCalendar'


export default function CalendarFrame(props) {
    const myLocalizer = momentLocalizer(moment) // Instantiates a localizer
    const senderId = 1;

    // State for storing fetched data
    const [responseTest, setResponseTest] = useState();

    // Sends backend request for users calendar
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/calendar/fetch_user_calendar', {
            params: {
                sender_id: senderId
            }
        })
        .then(response => {
            console.log(response.data);
            setResponseTest(response.data); // Update state with fetched data
        })
        .catch(error => {
            console.error("Unable to fetch calendar data", error);
        });
    }, [senderId]);

    return(
        <>
        <h1 className='test'>
            { JSON.stringify(responseTest) }

        </h1>
        <div className=''>
            { <DndCalendar localizer={myLocalizer} /> }
            { /*<EventCalendar />*/ }
        </div>
        </>
    );
}


/*
// Get the Hour/Minute/Sec in the given time zone
function getCurrentTimeInTimeZone(timeZone) {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // Use 24-hour time format; set to true for 12-hour format
    });

    return formatter.format(now);
}

// Function to get the current date in Month/Day/Year format in a specific time zone
function getCurrentDateInTimeZone(timeZone) {
    return new Date().toLocaleDateString('en-US', { timeZone });
}

// Takes a string Month/Day/Year (as numbers) and converts it to an object {Month: int, Day: int, Year: int}
function dateStringToDict(date) {
    let parts = date.split('/');
    return {
      Month: parseInt(parts[0], 10),
      Day: parseInt(parts[1], 10),
      Year: parseInt(parts[2], 10)
    };
  }
  
// Takes a string Hour:Minute:Second (as numbers) and converts it to an object {Hour: int, Minute: int, Second: int}
function timeStringToDict(time) {
    let parts = time.split(':');
    return {
        Hour: parseInt(parts[0], 10),
        Minute: parseInt(parts[1], 10),
        Second: parseInt(parts[2], 10)
    };
}

// Takes in two dictionaries date and time formatted as {Month: '', Day: '', Year:''} {Hour: '', Minute:''}
function createEvent(date, time){

}
*/