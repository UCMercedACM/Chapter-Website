import {
  doc,
  getDoc,
  collection,
  updateDoc,
  getDocs,
  arrayUnion,
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
      console.log(doc, "doc");
      joinedEventID.push(doc.data().apiID);
    }
  });
  console.log(joinedEventID);
  if (!joinedEventID) {
    error = "noMatchingCode";
    console.error(error);
    return { error };
  } else {
    console.log(joinedEventID, "hmm");
    if (
      attendedEvents.length > 0 &&
      attendedEvents.includes(joinedEventID[0])
    ) {
      console.log(
        user.currentUser.email + " already joined the event: " + joinedEventID
      );
      error = "alreadyJoined";
    } else {
      console.log("updating eventsAttended", joinedEventID);

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
      const eventRef = doc(db, "events", joinedEventID);
      updateDoc(eventRef, {
        attendees: arrayUnion(
          user.currentUser.email.substring(
            0,
            user.currentUser.email.indexOf("@")
          )
        ),
      });
      console.log("event attendees are updated");
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
