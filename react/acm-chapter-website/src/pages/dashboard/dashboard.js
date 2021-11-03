import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import "../dashboard/dashboard.scss";
import { getUsersAttendedEvents } from "../../scripts/events";
import { useEffect } from "react";
import UserProfile from "./UserProfile";
import UserStats from "./UserStats";
import RecentEvents from "./RecentEvents";
import { firebase, auth } from "../../firebase/config";

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
  const [error, setError] = useState("");
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [attendedEventsIDs, setAttendedEventsIDs] = useState([]);
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

  useEffect(() => {
    const userRef = firebase
      .firestore()
      .collection("users")
      .doc(currentUser.id);
    userRef.get().then((doc) => {
      const attendedEventsIDs = doc.data().eventsAttended;
      console.log(attendedEventsIDs, "helooooo");
      setAttendedEventsIDs(attendedEventsIDs);
    });
  }, []);

  useEffect(() => {
    const eventRef = firebase.firestore().collection("events");
    let attendedEvents = [];
    attendedEventsIDs.forEach(async (eventID) => {
      const eventAttended = await eventRef.doc(eventID).get();
      console.log(eventAttended.data(), "eventAttended");
      attendedEvents = [...attendedEvents, eventAttended.data()];
      setAttendedEvents(attendedEvents);
    });
    console.log(attendedEvents, "??");
  }, [attendedEventsIDs]);

  let timeOfDay = getTimeOfDay();

  return (
    <main className="dashboard">
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
        </div>
        {/* <div className="dashboard__content__top__navbar">
          <a href="#">Overview</a>
          <a href="#">Settings</a>
        </div> */}
        <div className="dashboard__content__components">
          <div className="dashboard__content__components__left">
            <UserStats attendedEvents={attendedEvents} />
            <RecentEvents attendedEvents={attendedEvents} />
          </div>
          <div className="dashboard__content__components__right">
            <UserProfile attendedEvents={attendedEvents} />
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
