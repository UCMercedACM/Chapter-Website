import axios from "axios";
import { firebase } from "../firebase/config";

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
  detailedEvents.forEach((event) => {
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
    const codesRef = firebase.firestore().collection("codes");
    const eventRef = firebase
      .firestore()
      .collection("events")
      .doc(formattedEvent.apiID);
    eventRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          const eventWithoutCode = {
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
          eventRef.update(eventWithoutCode);
        } else {
          console.log("No such document!");
          eventRef.set(formattedEvent);
          codesRef.doc(formattedEvent.apiID).set(codeDoc);
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  });
}

export default uploadEventsToFirebase;
