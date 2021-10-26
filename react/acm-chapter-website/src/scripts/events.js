import { firebase } from "../firebase/config";

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
    .ref.update({ pastEvent: isPast, attandanceCode: code, type: category });
}

async function uploadEventsToFirebase() {
  const eventsRef = firebase.firestore().collection("events");
  const events = await getEvents();
  await Promise.all(
    events.forEach(async (event) => {
      const readyField = await addFirebaseFieldsToEvent(event);
      eventsRef.doc(events.apiID).set(readyField);
    })
  );
}

async function addHTMLtoEvent(event, htmlLink) {
  const eventsRef = firebase.firestore().collection("events");
  eventsRef.doc(event.apiID).ref.update({ htmlLink: htmlLink });
}

async function getEventsFromFirebase() {
  return firebase.firestore().collection("events").get();
}

export { uploadEventsToFirebase, getEventsFromFirebase, addHTMLtoEvent };
