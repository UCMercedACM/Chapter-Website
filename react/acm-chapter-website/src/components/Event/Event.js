import React from "react";
import { convertToTime, convertToMonthDate } from "../../helper/timeFunctions";

const Event = ({ events, type }) => {
  function headerSwitch(type) {
    switch (type) {
      case "past":
        return "Past Events";
      case "now":
        return "Events Live Right NOW!";
      case "future":
        return "Future Events";
      default:
        return "";
    }
  }
  function bgSwitcher(type) {
    switch (type) {
      case "past":
        return "#dbdbdb";
      case "now":
        return "#3da9fc";
      case "future":
        return "#f5f5f5";
      default:
        return "";
    }
  }

  return (
    <div className="event-item">
      <h1>{headerSwitch(type)}</h1>

      {events.map((event, i) => {
        return (
          <div
            className="events-item"
            key={i}
            style={{ backgroundColor: bgSwitcher(type) }}
          >
            <div className="event-item__left-container">
              <p className="event-item__left-container__event-date">
                {convertToMonthDate(event.startTime)}
              </p>
              <p className="event-item__left-container_event-time">
                {convertToTime(event.startTime, event.endTime)}
              </p>
            </div>
            <div className="event-item__middle-container">
              <h3 className="event-item__middle-container__event-name">
                {event.eventName}
              </h3>
              <p className="event-item__middle-container__event-description">
                {event.description}
              </p>
            </div>
            <div className="event-item__right-container">
              {event.location.includes("bit.ly/acm-ucm-discord") ? (
                // eslint-disable-next-line react/jsx-no-target-blank
                <a
                  href="https://bit.ly/acm-ucm-discord"
                  target="_blank"
                  className="event-item__right-container__event-location-zoom"
                >
                  Zoom
                </a>
              ) : (
                <p className="event-item__right-container__event-location">
                  {event.location}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Event;
