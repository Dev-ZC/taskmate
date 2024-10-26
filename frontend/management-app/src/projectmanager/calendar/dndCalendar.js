import React, { Fragment, useCallback, useMemo,useState, useRef, useEffect } from 'react'
import { Calendar, Views, DateLocalizer } from 'react-big-calendar'
import PropTypes from 'prop-types'
import events from './calendarEvents'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/css/react-big-calendar.css';

//const localizer = momentLocalizer(moment) // Instantiates a localizer
const DragAndDropCalendar = withDragAndDrop(Calendar) // Creates a drag and rop calendar

export default function DndCalendar({ localizer }) {
    const [myEvents, setMyEvents] = useState(events)

    const moveEvent = useCallback(
        ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
        const { allDay } = event
        if (!allDay && droppedOnAllDaySlot) {
            event.allDay = true
        }
        if (allDay && !droppedOnAllDaySlot) {
            event.allDay = false;
        }

        setMyEvents((prev) => {
            const existing = prev.find((ev) => ev.id === event.id) ?? {}
            const filtered = prev.filter((ev) => ev.id !== event.id)
            return [...filtered, { ...existing, start, end, allDay: event.allDay }]
        })
        },
        [setMyEvents]
    )

    const resizeEvent = useCallback(
        ({ event, start, end }) => {
        setMyEvents((prev) => {
            const existing = prev.find((ev) => ev.id === event.id) ?? {}
            const filtered = prev.filter((ev) => ev.id !== event.id)
            return [...filtered, { ...existing, start, end }]
        })
        },
        [setMyEvents]
    )

    const defaultDate = useMemo(() => new Date(2015, 3, 12), [])

    return(
        <Fragment>
            <div className="height600">
                <DragAndDropCalendar
                defaultDate={defaultDate}
                defaultView={Views.WEEK}
                events={myEvents}
                localizer={localizer}
                onEventDrop={moveEvent}
                onEventResize={resizeEvent}
                resizable
                popup
                />
            </div>
        </Fragment>
    )
}

DndCalendar.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
}
