import React, { useEffect, useRef } from 'react';
import Calendar from '@event-calendar/core';
import TimeGrid from '@event-calendar/time-grid';
import '@event-calendar/core/index.css';
import './vkurkoCalendar.css'

const EventCalendar = () => {
  const calendarRef = useRef(null);
  const ecRef = useRef(null);

  const handleEventDrop = (info) => {
    const { event, oldEvent } = info;
    console.log('Event dropped:', event);
    console.log('Old event details:', oldEvent);
    // Update the event in your data source or state
    // You may want to make an API call here to update the event on the server
  };

  const handleSelect = (info) => {
    const { start, end } = info;
    const title = prompt('Enter event title:');
    if (title) {
      const newEvent = {
        id: Date.now().toString(), // Generate a unique ID as a string
        start,
        end,
        title,
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
      };
      ecRef.current.addEvent(newEvent);
      // You may want to make an API call here to save the new event on the server
    }
  };

  useEffect(() => {
    if (calendarRef.current && !ecRef.current) {
      ecRef.current = new Calendar({
        target: calendarRef.current,
        props: {
          plugins: [TimeGrid],
          options: {
            view: 'timeGridWeek',
            events: [
              {
                id: '1',
                start: '2024-11-03T10:00:00',
                end: '2024-11-03T12:00:00',
                title: 'Event 1',
                backgroundColor: '#4CAF50',
                borderColor: '#4CAF50',
              },
              {
                id: '2',
                start: '2024-11-06T14:00:00',
                end: '2024-11-06T16:00:00',
                title: 'Event 2',
                backgroundColor: '#2196F3',
                borderColor: '#2196F3',
              },
            ],
            headerToolbar: {
              start: 'prev,next today',
              center: 'title',
              end: 'timeGridDay,timeGridWeek,dayGridMonth'
            },
            editable: true,
            eventDraggable: true,
            eventResizeable: true,
            selectable: true,
            eventDrop: handleEventDrop,
            select: handleSelect,
          }
        }
      });
    }

    return () => {
      if (ecRef.current) {
        ecRef.current.$destroy();
        ecRef.current = null;
      }
    };
  }, []);

  return <div ref={calendarRef} className="modern-calendar"></div>;
};

export default EventCalendar;