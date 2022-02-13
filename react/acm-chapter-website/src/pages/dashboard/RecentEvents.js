import React, { useState } from "react";
import { convertToMonthDate } from "../../helper/timeFunctions";
import { useAuth } from "../../contexts/AuthContext";
import { auth } from "../../firebase/config";
import { attendEvent } from "../../scripts/events";

const RecentEvents = ({ attendedEvents }) => {
  const [code, setCode] = useState();
  function codeHandler(e) {
    e.preventDefault();
    const { error } = attendEvent(auth, code);
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
      <div>
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
          <tbody>
            <tr>
              <th>Name</th>
              <th>Date</th>
            </tr>
            {attendedEvents.length > 0 &&
              attendedEvents.map((event) => {
                return (
                  <tr>
                    <td>{event.eventName}</td>
                    <td>{convertToMonthDate(event.startTime)}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentEvents;
