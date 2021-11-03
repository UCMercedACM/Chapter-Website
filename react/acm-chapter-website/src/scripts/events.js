import { firebase, auth } from "../firebase/config";

import getEvents from "./catLife";
import { categoryFinder } from "../helper/eventFunctions";

async function addFirebaseFieldsToEvent(event) {
  const eventsRef = firebase.firestore().collection("events");
  const currentDate = new Date();
  const isPast = event.startTime < currentDate;
  const code = (Math.random() + 1).toString(36).substring(7);
  const category = categoryFinder(event.eventName);
  eventsRef
    .doc(event.apiID)
    .update({ pastEvent: isPast, attandanceCode: code, type: category });
}

async function uploadEventsToFirebase() {
  const eventsRef = firebase.firestore().collection("events");
  const events = await getEvents();
  await Promise.all(
    events.forEach(async (event) => {
      const readyField = await addFirebaseFieldsToEvent(event);
      eventsRef.doc(event.apiID).set(readyField);
    })
  );
}

async function addHTMLtoEvent(event, htmlLink) {
  const eventsRef = firebase.firestore().collection("events");
  eventsRef.doc(event.apiID).update({ htmlLink: htmlLink });
}

async function getEventsFromFirebase() {
  const snapshot = await firebase.firestore().collection("events").get();
  return snapshot.docs.map((doc) => {
    console.log(doc.data(), "events");
    return doc.data();
  });
}

async function attendEvent(user, joinedEventCode) {
  console.log("attendEvent-start");
  let error = "";
  const userSnapShot = await firebase
    .firestore()
    .collection("users")
    .doc(user.id)
    .get();
  const attendedEvents = userSnapShot.data().eventsAttended;
  console.log("attendEvent userSnapshot", userSnapShot);
  console.log("attendEvent attendedEvent", attendedEvents);

  const codesSnapshot = await firebase.firestore().collection("codes").get();
  const joinedEventID = codesSnapshot.docs.map((doc) => {
    console.log(joinedEventCode, "joinedEventCode");
    console.log(doc.data().apiID, "apiIDs");
    console.log(doc.data().code, "codes");
    if (doc.data().code === joinedEventCode) {
      return doc.data().apiID;
    }
    return;
  });
  if (!joinedEventID) {
    error = "noMatchingCode";
    return { error };
  }
  console.log(joinedEventID[0]);
  if (
    attendedEvents.includes(joinedEventID[0]) ||
    attendedEvents === joinedEventID[0]
  ) {
    console.log(user.name + " already joined the event: " + joinedEventID);
    error = "alreadyJoined";
  } else {
    console.log("updating eventsAttended");

    return firebase
      .firestore()
      .collection("users")
      .doc(user.id)
      .update({ eventsAttended: [...attendedEvents, joinedEventID[0]] })
      .then(() => {
        console.log("eventsAttended updated successfully");
      })
      .catch((err) => {
        console.error(err);
      });
  }
  console.log("attendEvent-end");
  return { error };
}

async function getUsersAttendedEvents(user) {

  const userSnapShot = await firebase
    .firestore()
    .collection("users")
    .doc(user.id)
    .get();
  const attendedEvents = userSnapShot.data().eventsAttended;
  console.log(attendedEvents, "attended events of user: " + user.name);
  return attendedEvents;
}

export {
  uploadEventsToFirebase,
  getEventsFromFirebase,
  addHTMLtoEvent,
  attendEvent,
  getUsersAttendedEvents,
};
