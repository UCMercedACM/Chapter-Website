import React, { useEffect, useState } from "react";
import getEvents, { getPhoto } from "../../scripts/catLife";
import { convertToTime, convertToMonthDate } from "../../helper/timeFunctions";
import { Link } from "react-router-dom";
import uploadEventsToFirebase from "../../scripts/catLife";
import { getEventsFromFirebase } from "../../scripts/events";
import Event from "./Event";

const Events = () => {
  const [pastEvents, setPastEvents] = useState([]);
  const [nowEvents, setNowEvents] = useState([]);
  const [futureEvents, setFutureEvents] = useState([]);

  // useEffect(() => {
  //   uploadEventsToFirebase();
  // }, []);

  useEffect(() => {
    getEventsFromFirebase()
      .then((data) => {
        let past = [];
        let future = [];
        let now = [];
        data.sort(function (a, b) {
          if (a.startTime < b.startTime) {
            return -1;
          }
          if (a.startTime > b.startTime) {
            return 1;
          }
          return 0;
        });
        data.forEach((event) =>
          (new Date(event.endTime) < new Date()
            ? past
            : new Date(event.endTime) < new Date() && new Date(event.startTime)
            ? now
            : future
          ).push(event)
        );
        setFutureEvents(future);
        setNowEvents(now);
        setPastEvents(past.reverse());
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      {nowEvents[0] ? <Event events={nowEvents} type={"now"} /> : ""}
      {futureEvents[0] ? <Event events={futureEvents} type={"future"} /> : ""}
      {pastEvents[0] ? <Event events={pastEvents} type={"past"} /> : ""}
    </div>
  );
};

export default Events;
