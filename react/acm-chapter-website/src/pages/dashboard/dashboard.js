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
import { collection, getFirestore } from "firebase/firestore";

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
  const [attendedEventsIDs, setAttendedEventsIDs] = useState();
  const { logout, currentUser } = useAuth();
  const db = getFirestore();
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
    window.location.reload();
  }

  useEffect(() => {
    async function effectF() {
      console.log(auth.currentUser, "auth");
      console.log(currentUser, "currentUser");
      const attendedEventsIDsArr = await getUsersAttendedEvents(
        auth.currentUser
      );
      console.log(attendedEventsIDsArr);
      setAttendedEventsIDs(attendedEventsIDsArr);
      const attendedEvents = await getAttendedEventsContent(
        attendedEventsIDsArr
      );
      console.log(attendedEvents, "attendedEvents");
      return attendedEvents;
    }
    setAttendedEvents([effectF()]);
    setLoading(false);
  }, []);

  let timeOfDay = getTimeOfDay();

  function loadingHandle(value) {
    setLoading(value);
  }

  return (
    <main className="dashboard">
      {loading ? (
        <p>Loading</p>
      ) : (
        <section className="dashboard__content">
          <div className="dashboard__content__top">
            <h1 className="dashboard__content__top__heading">
              Good {timeOfDay} {auth.currentUser.name}
            </h1>
            <button
              onClick={handleLogout}
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
              <UserStats
                attendedEvents={attendedEvents}
                loadingHandle={loadingHandle}
                loading={loading}
              />
              <RecentEvents
                attendedEvents={attendedEvents}
                loadingHandle={loadingHandle}
                loading={loading}
              />
            </div>
            <div className="dashboard__content__components__right">
              <UserProfile
                attendedEvents={attendedEvents}
                loadingHandle={loadingHandle}
                loading={loading}
              />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
