import React, { useEffect, useState } from "react";
import getEvents, { getPhoto } from "../../scripts/catLife";
import { convertToTime, convertToMonthDate } from "../../helper/timeFunctions";
import { Link } from "react-router-dom";
import uploadEventsToFirebase from "../../scripts/catLife";
import { getEventsFromFirebase } from "../../scripts/events";

const Event = () => {
  const [events, setEvents] = useState([]);
  const [futureEvents, setFutureEvents] = useState([]);

  // useEffect(() => {
  //   uploadEventsToFirebase();
  // }, []);

  useEffect(() => {
    getEventsFromFirebase()
      .then((data) => {
        setEvents(data);
        const futureEventsData = data.filter((event) => {
          return !event.isPast;
        });
        setFutureEvents(futureEventsData);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      {futureEvents.map((event, i) => {
        return (
          <div
            className="events__upcoming__content__upcoming-list__bottom__event-item"
            key={i}
          >
            <div className="event-item-left-container">
              <p className="event-date">
                {convertToMonthDate(event.startTime)}
              </p>
              <p className="event-time">
                {convertToTime(event.startTime, event.endTime)}
              </p>
            </div>
            <div className="event-item-middle-container">
              <h3 className="event-name">{event.eventName}</h3>
              <p className="event-description">{event.description}</p>
            </div>
            <div className="event-item-right-container">
              <p className="event-location">{event.location}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Event;
