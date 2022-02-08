import React, { useEffect, useState } from "react";
import getEvents, { getPhoto } from "../../scripts/catLife";
import { convertToTime, convertToMonthDate } from "../../helper/timeFunctions";
import { Link } from "react-router-dom";
import uploadEventsToFirebase from "../../scripts/catLife";
import { getEventsFromFirebase } from "../../scripts/events";

const Event = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    uploadEventsToFirebase();
  }, []);

  useEffect(
    () => {
      uploadEventsToFirebase();
      console.log(new Date().toISOString(), "date");
      getEventsFromFirebase()
        .then((data) => {
          setEvents([data]);
        })
        .catch((err) => console.log(err));
    },
    [],
    1
  );

  return (
    <>
      {events.map((event) => {
        console.log(event);
        console.log(new Date(event.startTime).getTime(), "hello");
        console.log(new Date().getTime(), "??");
        console.log(
          new Date(event.startTime).getTime() < new Date().getTime(),
          "ok"
        );
        return (
          <div class="events__upcoming__content__upcoming-list__bottom__event-item">
            {new Date(events.startTime).getTime() < new Date().getTime() ? (
              <div>
                <p>{event.location}</p>
                <div class="event-item-left-container">
                  <p class="event-date">
                    {convertToMonthDate(event.startTime)}
                  </p>
                  <p class="event-time">
                    {convertToTime(event.startTime, event.endTime)}
                  </p>
                </div>
                <div class="event-item-middle-container">
                  <h3 class="event-name">{event.eventName}</h3>
                  <p class="event-description">{event.description}</p>
                </div>
                <div class="event-item-right-container">
                  <p class="event-location">{event.location}</p>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
};

export default Event;
