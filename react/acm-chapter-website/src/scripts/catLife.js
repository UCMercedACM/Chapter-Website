import axios from "axios";

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

async function getEvents() {
  const response = await axios.get(
    "https://api.presence.io/ucmerced/v1/organizations/events/association-for-computing-machinery-uc-merced"
  );
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
  const formattedEvents = detailedEvents.map((event) => {
    const formattedEvent = {
      apiID: event.apiId,
      eventName: event.eventName,
      description: tagRemover(event.description),
      location: event.isVirtualLink ? "Virtual" : event.location,
      startTime: event.startDateTimeUtc,
      endTime: event.endDateTimeUtc,
      image: event.hasCoverImage ? event.photoUri : "null",
    };
    return formattedEvent;
  });
  return formattedEvents;
}

export default getEvents;
