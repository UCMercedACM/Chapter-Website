import React from "react";
import SectionTitle from "./../../components/SectionTitle/SectionTitle";
import "./Events.scss";
import Event from "../../components/Event/Event";

const Events = () => {
  return (
    <main class="events">
      <section class="events__landing">
        <div class="events__landing__content">
          <h1 class="events__landing__content__title">EVENTS AND ACTIVITES</h1>
          <h3 class="events__landing__content__text">
            Keep up to date with our events and activities!
          </h3>
          <div class="events__landing__content__button">
            <div class="events__landing__content__button__front">
              <a href="#" class="events__landing__content__button__front__text">
                Join our mailing list!
              </a>
            </div>
            <div class="events__landing__content__button__behind"></div>
          </div>
        </div>
      </section>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        class="events__wave"
      >
        <path
          fill="#00e1bfcc"
          fill-opacity="1"
          d="M0,256L80,224C160,192,320,128,480,122.7C640,117,800,171,960,192C1120,213,1280,203,1360,197.3L1440,192L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
        ></path>
      </svg>
      <section class="events__events-overview">
        <div class="events__events-overview__content">
          <SectionTitle text="Fall 2021 Events Overview" />
          <div class="events__events-overview__content__event-list">
            <div class="events__events-overview__content__event-list__item">
              <p>Artificial Intelligence (AI) SIG Workshops</p>
            </div>
            <div class="events__events-overview__content__event-list__item">
              <p>Cybersecurity SIG Workshops</p>
            </div>
            <div class="events__events-overview__content__event-list__item">
              <p>Software Engineering (SWE) SIG Workshops</p>
            </div>
            <div class="events__events-overview__content__event-list__item">
              <p>General Meetings</p>
            </div>
          </div>
        </div>
      </section>
      <section class="events__upcoming">
        <div class="events__upcoming__content">
          <SectionTitle text="Upcoming Events" />
          <div class="events__upcoming__content__upcoming-list">
            <div class="events__upcoming__content__upcoming-list__top">
              <div class="events__upcoming__content__upcoming-list__top__decorative-buttons">
                <div class="events__upcoming__content__upcoming-list__top__decorative-buttons__first"></div>
                <div class="events__upcoming__content__upcoming-list__top__decorative-buttons__second"></div>
                <div class="events__upcoming__content__upcoming-list__top__decorative-buttons__third"></div>
              </div>
            </div>
            <div class="events__upcoming__content__upcoming-list__bottom">
              <Event />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Events;
