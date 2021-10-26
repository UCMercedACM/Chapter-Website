import { addHTMLtoEvent } from "./events";

const gapi = window.gapi;
/*
    Update with your own Client Id and Api key
  */
const CLIENT_ID = "";
const API_KEY = "";
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
];
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

function formatEvent(event) {
  return {
    summary: event.eventName,
    location: event.location,
    description: event.description,
    start: {
      dateTime: event.startTime.substring(0, event.startTime.length - 1),
      timeZone: "UTC",
    },
    endTime: {
      dateTime: event.startTime.substring(0, event.startTime.length - 1),
      timeZone: "UTC",
    },
  };
}

const addEventsToGoogleCalendar = (events) => {
  gapi.load("client:auth2", () => {
    console.log("loaded client");

    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    });

    gapi.client.load("calendar", "v3", () => console.log("bam!"));

    gapi.auth2
      .getAuthInstance()
      .signIn()
      .then(async () => {
        await Promise.all(
          events.map(async (event) => {
            const formattedEvent = formatEvent(event);
            const request = gapi.client.calendar.events.insert({
              calendarId: formattedEvent.apiID,
              resource: formattedEvent,
            });

            request.execute((respondEvent) => {
              console.log(respondEvent);
              addHTMLtoEvent(formattedEvent, respondEvent.htmlLink);
            });
          })
        );
      });
  });
};

export default addEventsToGoogleCalendar;
