import React from "react";
import "../../sass/components/Leadership.scss";
import SectionTitle from "../SectionTitle/SectionTitle";
import leaderships from "../../assets/data/leaderships.json";

const Leadership = () => {
  return (
    <section class="home__leadership">
      <SectionTitle text="ACM Board" />
      <div class="home__leadership__members">
        {leaderships.map((leadership) => {
          console.log(leadership.picture);
          return (
            <div class="home__leadership__member__profile">
              <img src={leadership.picture} alt={leadership.firstName} />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Leadership;
