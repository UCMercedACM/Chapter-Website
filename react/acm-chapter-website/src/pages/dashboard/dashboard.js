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
    <div className="user-stats">
      <div className="user-stats__left dashboard-component">
        <h1>{userData.levelInfo.points} pts</h1>
        <p>
          Level {userData.levelInfo.level}
        </p>
      </div>

      <div className="user-stats__middle dashboard-component">
        <h1>{userData.recentEvents.length}</h1>
        <p>Events Attended</p>
      </div>

      <div className="user-stats__right dashboard-component">
        <h1>{userData.levelInfo.leaderboardPosition}th</h1>
        <p>In Leaderboard</p>
      </div>
    </div>
  );
};

const UserProfile = () => {
  return (
    <div className="user-profile dashboard-component">
      <section>
        <div className="user-profile__profile-pic"></div>
        <p className="user-profile__join-date">
          Joined {userData.profile.joinDate}
        </p>
      </section>
      <section>
        <div className="user-profile__about-top">
          <h3 className="user-profile__about-top__heading">About me</h3>
          <button className="user-profile__about-top__edit-btn">Edit</button>
        </div>
        <div className="user-profile__about-bottom">
          <p className="user-profile__about-bottom__bio">
            {userData.profile.bio}
          </p>
        </div>
      </section>
    </div>
  );
};

const RecentEvents = () => {
  return (
    <div className="recent-events dashboard-component">
      <h2 className="recent-events__heading dashboard-component-heading">Events You Attended</h2>
      <input type="text" name="eventCodeInput" id="eventCodeInput" placeholder="Enter event code" autoComplete="off" />
      <table className="recent-events__table">
        <tr>
          <th>Name</th>
          <th>Date</th>
        </tr>
        {userData.recentEvents.map((event) => {
          return (
            <tr>
              <td>{event.name}</td>
              <td>{event.date}</td>
            </tr>
          );
        })}
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
    <main className="dashboard">
      <section className="dashboard__content">
        <div className="dashboard__content__top">
          <h1 className="dashboard__content__top__heading">
            Good {timeOfDay} {currentUser.name}
          </h1>
          <button 
            onclick={handleLogout} 
            type="logout" 
            className="dashboard__content__top__log-out-btn"
          >
            Log Out
          </button>
        </div>
        {/* <div className="dashboard__content__top__navbar">
          <a href="#">Overview</a>
          <a href="#">Settings</a>
        </div> */}
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
  );
}
