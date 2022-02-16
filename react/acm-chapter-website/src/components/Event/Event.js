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
    <div className="pastEvents">
      <h1>{headerSwitch(type)}</h1>

      {events.map((event, i) => {
        return (
          <div
            className="events__upcoming__content__upcoming-list__bottom__event-item"
            key={i}
            style={{ backgroundColor: bgSwitcher(type) }}
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
              {event.location.includes("bit.ly/acm-ucm-discord") ? (
                <a
                  href="https://bit.ly/acm-ucm-discord"
                  target="_blank"
                  className="event-location-zoom"
                >
                  Zoom
                </a>
              ) : (
                <p className="event-location">{event.location}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Event;
