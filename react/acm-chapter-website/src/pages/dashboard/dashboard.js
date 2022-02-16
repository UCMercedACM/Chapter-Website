import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "../dashboard/dashboard.scss";
import {
  getAttendedEventsContent,
  getUsersAttendedEvents,
} from "../../scripts/events";
import { useEffect } from "react";
import UserProfile from "./UserProfile";
import UserStats from "./UserStats";
import RecentEvents from "./RecentEvents";
import { auth } from "../../firebase/config";
import { useAuth } from "../../contexts/AuthContext";
import useSessionStorage from "./../../hooks/useSessionStorage";

const getTimeOfDay = () => {
  const currDate = new Date();
  let currHour = currDate.getHours();

  if (currHour >= 0 && currHour < 12) {
    return "morning";
  } else if (currHour >= 12 && currHour < 18) {
    return "afternoon";
  } else {
    return "evening";
  }
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attendedEvents, setAttendedEvents] = useState();

  const history = useHistory();

  const { logout, currentUser, authUser } = useAuth();

  async function handleLogout() {
    setError("");
    try {
      await logout();
    } catch (err) {
      console.log(err);
      setError("Failed to log out");
    }
  }

  useEffect(() => {
    if (authUser && authUser !== "loggedOut") {
      getUsersAttendedEvents(authUser.uid).then((data) => {
        getAttendedEventsContent(data).then((data2) => {
          setAttendedEvents(data2);
          setLoading(false);
        });
      });
    }
    if (authUser === "loggedOut") {
      history.push("/login");
    }
  }, [authUser]);

  let timeOfDay = getTimeOfDay();

  return (
    <main className="dashboard">
      {loading || !attendedEvents ? (
        <p>Loading</p>
      ) : (
        <section className="dashboard__content">
          <div className="dashboard__content__top">
            <h1 className="dashboard__content__top__heading">
              Good {timeOfDay} {currentUser.name}
            </h1>
            <button
              onClick={handleLogout}
              className="dashboard__content__top__log-out-btn"
            >
              Log Out
            </button>
            {error}
          </div>
          {/* <div className="dashboard__content__top__navbar">
          <a href="#">Overview</a>
          <a href="#">Settings</a>
        </div> */}
          <div className="dashboard__content__components">
            <div className="dashboard__content__components__left">
              <UserStats attendedEvents={attendedEvents} />
            </div>
            <div className="dashboard__content__components__right">
              <RecentEvents attendedEvents={attendedEvents} />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
