import React, { useEffect, useState } from "react";
import getEvents, { getPhoto } from "../../scripts/catLife";
import { convertToTime, convertToMonthDate } from "../../helper/timeFunctions";

const Event = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEvents()
      .then((data) => {
        setEvents(data);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      {events.map((event) => {
        console.log(event.startTime);
        return (
          <div class="events__upcoming__content__upcoming-list__bottom__event-item">
            <div class="event-item-left-container">
              <p class="event-date">{convertToMonthDate(event.startTime)}</p>
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
        );
      })}
    </>
  );
};

export default Event;
