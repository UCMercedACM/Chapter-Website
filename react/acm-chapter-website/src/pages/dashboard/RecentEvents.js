import React, { useState } from "react";
import { convertToMonthDate } from "../../helper/timeFunctions";
import { useAuth } from "../../contexts/AuthContext";
import { attendEvent } from "../../scripts/events";

const RecentEvents = ({ attendedEvents }) => {
  const { currentUser } = useAuth();
  const [code, setCode] = useState();
  function codeHandler(e) {
    e.preventDefault();
    const { error } = attendEvent(currentUser, code);
    if (error) {
      console.log(error);
    }
  }
  function onCodeChange(e) {
    console.log(e.target.value, "code-change");
    setCode(e.target.value);
  }

  return (
    <div className="recent-events dashboard-component">
      <h2 className="recent-events__heading dashboard-component-heading">
        Events You Attended
      </h2>
      <form onSubmit={codeHandler}>
        <input
          type="text"
          name="eventCodeInput"
          id="eventCodeInput"
          placeholder="Enter event code"
          autoComplete="off"
          value={code}
          onChange={onCodeChange}
        />
      </form>
      <table className="recent-events__table">
        <tr>
          <th>Name</th>
          <th>Date</th>
        </tr>
        {attendedEvents.map((event) => {
          console.log(attendedEvents, "RecentEvents");
          console.log(event, "event");
          return (
            <tr>
              <td>{event.eventName}</td>
              <td>{convertToMonthDate(event.startTime)}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default RecentEvents;
