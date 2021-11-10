import React from "react";
import userData from "./testUserData";

const UserStats = ({ attendedEvents }) => {
  return (
    <div className="user-stats">
      <div className="user-stats__left dashboard-component">
        <h1>{attendedEvents.length * 50} pts</h1>
        <p>
          Level{" "}
          {attendedEvents.length !== 0
            ? Math.floor(1 + (attendedEvents.length * 50) / 150)
            : 1}
        </p>
      </div>

      <div className="user-stats__middle dashboard-component">
        <h1>{attendedEvents.length}</h1>
        <p>Events Attended</p>
      </div>

      <div className="user-stats__right dashboard-component">
        {/* <h1>{userData.levelInfo.leaderboardPosition}th</h1>
        <p>In Leaderboard</p> */}
        <p>Leaderboard Coming Soon!</p>
      </div>
    </div>
  );
};

export default UserStats;
