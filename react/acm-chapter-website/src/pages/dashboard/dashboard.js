import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import "../dashboard/dashboard.scss";
import userData from "./testUserData";

const getTimeOfDay = () => {
  const currDate = new Date();
  let currHour = currDate.getHours();

  if (currHour >= 0 && currHour < 12) {
    return "morning";
  }
  else if (currHour >= 12 && currHour < 18) {
    return "afternoon";
  }
  else {
    return "evening";
  }
};

const UserStats = () => {
  return (
    <div className="user-stats dashboard-component">
      <div className="user-stats__left">
        <h2 className="dashboard-component-heading">
          Level {userData.levelInfo.level}
        </h2>
        <div className="user-stats__left__points-description">
          <h1>{userData.levelInfo.points}/585</h1>
        </div>
        <p>
          {userData.levelInfo.pointsUntilNextLevel} points until next level
        </p>
      </div>

      <div className="user-stats__middle">
        <h1>{userData.recentEvents.length}</h1>
        <p>Events Attended</p>
      </div>

      <div className="user-stats__right">
        <h1>{userData.levelInfo.leaderboardPosition}th</h1>
        <p>In Leaderboard</p>
      </div>
    </div>
  );
};

const UserProfile = () => {
  return (
    <div className="user-profile dashboard-component">
      <h2 className="dashboard-component-heading">User Profile</h2>
    </div>
  );
};

const RecentEvents = () => {
  return (
    <div className="recent-events dashboard-component">
      <h2 className="dashboard-component-heading">Events You Attended</h2>
      <input type="text" name="eventCodeInput" id="eventCodeInput" placeholder="Enter event code" autoComplete="off" />
      <table>
        <tr>
          <th>Name</th>
          <th>Date</th>
        </tr>
      </table>
    </div>
  );
};

export default function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  async function handleLogout() {
    setError("");

    try {
      await logout();
      history.push("/login");
    } catch (err) {
      console.log(err);
      setError("Failed to log out");
    }
  }

  let timeOfDay = getTimeOfDay();
  
  return (
    <>
      <main className="dashboard">
        <section className="dashboard__content">
          <h1 className="dashboard__content__heading">
            Good {timeOfDay} {currentUser.name}
          </h1>
          <div className="dashboard__content__navbar">
            <a href="#">Overview</a>
            <a href="#">Settings</a>
          </div>
          <div className="dashboard__content__components">
            <div className="dashboard__content__components__left">
              <UserStats />
              <RecentEvents />
            </div>
            <div className="dashboard__content__components__right">
              <UserProfile />
            </div>
          </div>
        </section>
        {/* <div className="login__landing">
          <header>
            <h2>Profile</h2>
            <p>Welcome {currentUser.name}</p>
          </header>

          <button onClick={handleLogout} type="logout">
            Logout
          </button>
          {error && <p>{error}</p>}
        </div> */}
      </main>
    </>
  );
}
