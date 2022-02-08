import axios from "axios";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

export async function getPhoto(uri) {
  let photo;
  try {
    photo = await axios.get(
      `https://ucmerced-cdn.presence.io/event-photos/8fd48e04-025a-4b9c-9e7b-595adaeb479c/${uri}`
    );
  } catch (err) {
    return err;
  }
  return photo;
}

function tagRemover(description) {
  return description.replace(/<\/?p[^>]*>/g, "");
}

async function uploadEventsToFirebase() {
  const response = await axios.get(
    "https://api.presence.io/ucmerced/v1/organizations/events/association-for-computing-machinery-uc-merced"
  );
  if (!response.data) {
    console.log("no data");
    return [];
  }
  const detailedEvents = await Promise.all(
    response.data.map(async (event) => {
      let detailedEvent;
      try {
        detailedEvent = await axios.get(
          `https://api.presence.io/ucmerced/v1/events/${event.uri}`
        );
      } catch (err) {
        return err;
      }
      console.log(detailedEvent.data, "33");
      return detailedEvent.data;
    })
  );

  // const categories = ["workshop", "general", "talk", "koding kata"];

  // function categoryFinder(eventName) {
  //   const lowerName = eventName.toLowerCase();
  //   categories.forEach((category) => {
  //     if (lowerName.includes(category)) {
  //       return category;
  //     }
  //   });
  // }
  detailedEvents.forEach(async (event) => {
    const code = (Math.random() + 1).toString(36).substring(7);
    const formattedEvent = {
      apiID: event.apiId,
      eventName: event.eventName,
      description: tagRemover(event.description),
      location: event.isVirtualLink ? "Virtual" : event.location,
      startTime: event.startDateTimeUtc,
      endTime: event.endDateTimeUtc,
      image: event.hasCoverImage ? event.photoUri : "null",
      isPast: event.startTime < new Date(),
      // category: categoryFinder(event.eventName),
    };
    const codeDoc = {
      apiID: event.apiId,
      code: code,
    };
    const eventRef = doc(db, "events", formattedEvent.apiID);
    const eventSnap = await getDoc(eventRef);
    console.log(eventSnap.data(), "eventSnap");
    if (eventSnap.exists()) {
      updateDoc(eventRef, {
        apiID: event.apiId,
        eventName: event.eventName,
        description: tagRemover(event.description),
        location: event.isVirtualLink ? "Virtual" : event.location,
        startTime: event.startDateTimeUtc,
        endTime: event.endDateTimeUtc,
        image: event.hasCoverImage ? event.photoUri : "null",
        isPast: event.startTime < new Date(),
        // category: categoryFinder(event.eventName),
      });
    } else {
      console.log("No such document!");
      setDoc(eventRef, {
        formattedEvent,
      });
      const codeRef = doc(db, "codes", formattedEvent.apiID);
      const code = await getDoc(codeRef);

      console.log(code.data());
      setDoc(codeRef, {
        codeDoc,
      });
    }
  });
}

export default uploadEventsToFirebase;
