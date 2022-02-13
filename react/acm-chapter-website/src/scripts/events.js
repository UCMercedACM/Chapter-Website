import {
  doc,
  getDoc,
  collection,
  onSnapshot,
  updateDoc,
  getDocFromCache,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/config";

async function addHTMLtoEvent(event, htmlLink) {
  const eventRef = doc(db, "events", event.apiID);
  updateDoc(eventRef, {
    htmlLink: htmlLink,
  });
}

async function getEventsFromFirebase() {
  let events = [];
  const querySnapshot = await getDocs(collection(db, "events"));
  querySnapshot.forEach((doc) => {
    events.push(doc.data());
  });
  console.log(events, "events");
  return events;
}

async function attendEvent(user, joinedEventCode) {
  console.log(user);
  console.log("attendEvent-start");
  let error = "";
  const userRef = await getDoc(doc(db, "users", user.currentUser.uid));
  const attendedEvents = userRef.data().eventsAttended;
  console.log("attendEvent attendedEvents", attendedEvents);

  // const codesSnapshot = await firebase.firestore().collection("codes").get();
  let joinedEventID = [];
  const querySnapshot = await getDocs(collection(db, "codes"));
  querySnapshot.forEach((doc) => {
    if (doc.data().code === joinedEventCode) {
      console.log(doc.data(), "CODE FOUND");
      joinedEventID.push(doc.data().apiID);
    }
  });

  if (!joinedEventID) {
    error = "noMatchingCode";
    console.error(error);
    return { error };
  }
  console.log(joinedEventID, "hmm");
  if (attendedEvents.length > 0 && attendedEvents.includes(joinedEventID)) {
    console.log(
      user.currentUser.email + " already joined the event: " + joinedEventID
    );
    error = "alreadyJoined";
  } else {
    console.log("updating eventsAttended");

    const userRef = doc(db, "users", user.currentUser.uid);
    if (attendedEvents.length !== 0) {
      console.log(attendedEvents);
      const newEvents = attendedEvents.concat(joinedEventID);
      updateDoc(userRef, {
        eventsAttended: newEvents,
      });
      console.log("eventsAttended updated successfully");
    } else {
      updateDoc(userRef, {
        eventsAttended: joinedEventID,
      });
      console.log("eventsAttended updated successfully");
    }
  }
  console.log("attendEvent-end");
  return { error };
}

async function getUsersAttendedEvents(uid) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  const attendedEvents = userSnap.data().eventsAttended;
  return attendedEvents;
}

async function getAttendedEventsContent(ids) {
  const attendedEvents = await Promise.all(
    ids.map(async (eventID) => {
      const eventRef = doc(db, "events", eventID);
      const eventAttended = await getDoc(eventRef);
      return eventAttended.data();
    })
  );
  return attendedEvents;
}

export {
  getEventsFromFirebase,
  addHTMLtoEvent,
  attendEvent,
  getUsersAttendedEvents,
  getAttendedEventsContent,
};
