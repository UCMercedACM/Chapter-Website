import { useEffect, useState } from "react";
import GlobalFooter from "../components/GlobalFooter";
import GlobalNavbar from "../components/GlobalNavbar";
import { fetchEvents } from "../hooks/events";
import { SectionTitle } from "../components/SectionTitle";
import EventsTable from "../components/EventsTable";

const Events = () => {
  const [events, setEvents] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      const eventsData = await fetchEvents();
      setEvents(eventsData);
    }

    fetchData();
  }, []);
  return (
    <>
      <GlobalNavbar />
      <div className="sigs">
        <section className="h-full pt-36 lg:pb-24 bg-landing-secondary">
          <div className="flex flex-col content-end font-montserrat">
            <h1 className="text-[72px] text-center font-normal tracking-wider text-tertiary font-bebas">Events and Activities</h1>
            <p className="px-80 text-white font-montserrat tracking-wider text-center text-[21px] leading-10">
                Keep up to date with our events and activities!
            </p>
            <div className="flex justify-center align-center mt-8">
                <button className="events__maillist__button">Join our mailing list</button>
            </div>
          </div>
        </section>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 280"
          className="home__wave"
        >
          <path
            fill="#00e1bfcc"
            fillOpacity="1"
            d="M0,256L80,224C160,192,320,128,480,122.7C640,117,800,171,960,192C1120,213,1280,203,1360,197.3L1440,192L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          ></path>
        </svg>

        <section>
          <SectionTitle title="Fall 2024 Events Overview"/>

          <div className="lg:grid lg:grid-cols-2 lg:place-items-center lg:py-12 lg:px-96 lg:gap-4 flex flex-col items-center justify-center font-montserrat">
            <div className="px-12 py-16 w-full shadow-base-white shadow-lg text-center text-xl rounded-3xl"><p>Artificial Intelligence (AI) SIG Workshops</p></div>
            <div className="px-12 py-16 w-full shadow-base-white shadow-lg text-center text-xl rounded-3xl"><p>Cybersecurity SIG Workshops</p></div>
            <div className="px-12 py-16 w-full shadow-base-white shadow-lg text-center text-xl rounded-3xl"><p>Software Engineering (SWE) SIG Workshops</p></div>
            <div className="px-12 py-16 w-full shadow-base-white shadow-lg text-center text-xl rounded-3xl"><p>General Meetings</p></div>
          </div>

        </section>

        <section>
          <SectionTitle title="Upcoming Events"/>

          <div className="mx-28">
            { events && <EventsTable events={events}/> }
          </div>
        </section>
      </div>
      <GlobalFooter />
    </>

  );
};

export default Events;