import { firebase, auth } from "../firebase/config";

import getEvents from "./catLife";
import { categoryFinder } from "../helper/eventFunctions";

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
  console.log("attendEvent attendedEvents", attendedEvents);

  // const codesSnapshot = await firebase.firestore().collection("codes").get();
  let joinedEventID = "";
  await firebase
    .firestore()
    .collection("codes")
    .get()
    .then((doc) => {
      doc.forEach((doc) => {
        if (doc.data().code === joinedEventCode) {
          console.log(doc.data(), "CODE FOUND");
          joinedEventID = doc.data().apiID;
        }
      });
    });

  if (!joinedEventID) {
    error = "noMatchingCode";
    console.error(error);
    return { error };
  }
  console.log(joinedEventID, "hmm");
  if (
    attendedEvents.includes(joinedEventID) ||
    attendedEvents === joinedEventID
  ) {
    console.log(user.name + " already joined the event: " + joinedEventID);
    error = "alreadyJoined";
  } else {
    console.log("updating eventsAttended");

    return firebase
      .firestore()
      .collection("users")
      .doc(user.id)
      .update({ eventsAttended: [...attendedEvents, joinedEventID] })
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
  getEventsFromFirebase,
  addHTMLtoEvent,
  attendEvent,
  getUsersAttendedEvents,
};
