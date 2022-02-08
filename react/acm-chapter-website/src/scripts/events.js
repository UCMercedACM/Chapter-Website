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
  console.log("attendEvent-start");
  let error = "";
  const attendedEvents = await getDoc(doc(db, "users", "user.uid"));
  console.log("attendEvent attendedEvents", attendedEvents.data());

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
  if (attendedEvents.includes(joinedEventID)) {
    console.log(user.name + " already joined the event: " + joinedEventID);
    error = "alreadyJoined";
  } else {
    console.log("updating eventsAttended");

    const userRef = doc(db, "users", user.id);
    updateDoc(userRef, {
      eventsAttended: [...attendedEvents, joinedEventID],
    });
    console.log("eventsAttended updated successfully");
  }
  console.log("attendEvent-end");
  return { error };
}

async function getUsersAttendedEvents(user) {
  console.log(user.uid, "userId");
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  const attendedEvents = userSnap.data().eventsAttended;
  console.log(attendedEvents, "attended events of user: " + user.name);
  return attendedEvents;
}

async function getAttendedEventsContent(ids) {
  let attendedEvents = [];
  ids.forEach(async (eventID) => {
    const eventRef = doc(db, "events", eventID);
    const eventAttended = await getDoc(eventRef);
    console.log(eventAttended.data(), "eventAttended");
    attendedEvents.push(eventAttended.data());
  });
  console.log(attendedEvents, "attendedEvents");
  return attendedEvents;
}

export {
  getEventsFromFirebase,
  addHTMLtoEvent,
  attendEvent,
  getUsersAttendedEvents,
  getAttendedEventsContent,
};
