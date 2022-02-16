import React from "react";
import userData from "./testUserData";

const UserStats = ({ attendedEvents }) => {
  return (
    <div className="user-stats">
      <div>
        <div className="user-stats__top dashboard-component">
          <h1>{attendedEvents.length * 50} pts</h1>
          <p>
            Level{" "}
            {attendedEvents.length !== 0
              ? Math.floor(1 + (attendedEvents.length * 50) / 150)
              : 1}
          </p>
        </div>

        <div className="user-stats__bottom dashboard-component">
          <h1>{attendedEvents.length}</h1>
          <p>Events Attended</p>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
