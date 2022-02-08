import React from "react";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import acmLanParty from "../../assets/images/about-us.png";
import projectManagement from "../../assets/images/project-management.png";
import educationalTransperencyIcon from "../../assets/images/online-course.png";
import community from "../../assets/images/communities.png";
import socialResponsibiliy from "../../assets/images/social-responsibility.png";
import acmLogo from "../../assets/images/acm_logo_v2.png";
import sweLogo from "../../assets/images/swe_logo_v2.png";
import aiLogo from "../../assets/images/ai_logo_v2.png";
import cyberLogo from "../../assets/images/cyber_logo_v2.png";
import designLogo from "../../assets/images/design_logo_v2.png";
import iotLogo from "../../assets/images/iot_logo_v2.png";

import "./Home.scss";
import Leadership from "../../components/Leadership/Leadership";

import landingAnimation from "./landingAnimation.svg";
import wave from "./wave.svg";

import Footer from "../../components/Footer/Footer";

function Home() {
  return (
    <main class="home">
      <section class="home__landing">
        <div class="home__landing__content">
          <div class="home__landing__content__left">
            <h4 class="home__landing__content__left__sub-title">Welcome to</h4>
            <h1 class="home__landing__content__left__title">
              Association for Computing Machinery
            </h1>
            <p class="home__landing__content__left__text">
              ACM, the world’s largest educational and scientific computing
              society, delivers resources that advance computing as a science
              and a profession. We are just your friendly neighborhood student
              chapter at UC Merced.
            </p>
            <a
              class="home__landing__content__left__button"
              href="http://bit.ly/acm-ucm-discord"
            >
              Discord
            </a>
          </div>
          <div className="home__landing__content__right">
            <object
              className="home__landing__right__animation"
              type="image/svg+xml"
              data={landingAnimation}
            ></object>
          </div>
        </div>
      </section>

      <img src={wave} alt="wave" />

      <section class="home__about-us">
        <SectionTitle text="About Us" />
        <div class="home__about-us__container">
          <p class="home__about-us__container__text">
            Association for Computing Machinery (ACM) is the biggest computing
            organization at University of California, Merced. We build a
            community of students, developers, designers, and professionals. We
            host many events ranging from Coffee and Code, Koding Kata, and LAN
            Parties to SIG events including introduction to UI/UX,
            Cybersecurity, IOT, Artificial Intelligence, and Software
            Engineering.
            <br />
            <br />
            We aim to provide a strong sense of community to all engineering
            students with a particular focus on students studying computer
            science. We also host activities such as tech talks, capture the
            flag, movie nights, game nights, and Friday socials. Join our
            organization and get involved in our general meetings!
          </p>
          <div class="home__about-us__container__image">
            <div class="home__about-us__container__image__front">
              <img src={acmLanParty} alt="ACM LAN Party" />
            </div>
            <div class="home__about-us__container__image__behind"></div>
          </div>
        </div>
      </section>
      <section class="home__goals">
        <SectionTitle text="Goals" />
        <div class="home__goals__grid">
          <div class="home__goals__grid__cell">
            <img src={projectManagement} alt="Technical Excellence Icon" />
            <div class="home__goals__grid__cell__content">
              <h4 class="home__goals__grid__cell__content__heading">
                Technical Excellence
              </h4>
              <p class="home__goals__grid__cell__content__text">
                Preparing the club and its members for work in the industry, at
                the highest quality of efficiency and scalability.
              </p>
            </div>
          </div>
          <div class="home__goals__grid__cell">
            <img
              src={educationalTransperencyIcon}
              alt="Educational Transparency Icon"
            />
            <div class="home__goals__grid__cell__content">
              <h4 class="home__goals__grid__cell__content__heading">
                Educational Transparency
              </h4>
              <p class="home__goals__grid__cell__content__text">
                Allowing ease of access for all academic topics related to
                computer science and in our course materials.
              </p>
            </div>
          </div>
          <div class="home__goals__grid__cell">
            <img src={community} alt="Community Icon" />
            <div class="home__goals__grid__cell__content">
              <h4 class="home__goals__grid__cell__content__heading">
                Community
              </h4>
              <p class="home__goals__grid__cell__content__text">
                Providing a welcoming environment for computer scientists from
                all areas of technical knowledge and tying that back to a sense
                of campus culture.
              </p>
            </div>
          </div>
          <div class="home__goals__grid__cell">
            <img src={socialResponsibiliy} alt="Social Responsibility Icon" />
            <div class="home__goals__grid__cell__content">
              <h4 class="home__goals__grid__cell__content__heading">
                Social Responsibility
              </h4>
              <p class="home__goals__grid__cell__content__text">
                Ensuring that our members are involved in social and corporate
                environments that uphold high standards of ethical and moral
                responsibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="home__sigs">
        <SectionTitle text="Special Interest Groups" />
        <div class="home__sigs__container">
          <div class="home__sigs__container__sig">
            <img src={acmLogo} alt="ACM" />
            <p>
              <br></br> ACM’s Special Interest Groups (SIGs) represent the major
              areas of the dynamic computing field. <br></br>We are invested in
              advancing the skills of our members, keeping them abreast of
              emerging trends. <br></br>
            </p>
          </div>
          <div class="home__sigs__container__sig">
            <img src={sweLogo} alt="Software Engineering SIG" />
            <p>
              <br></br>The ACM Special Interest Group on Software Engineering
              provides a forum for computing professionals from industry,
              community, and academia to examine principles, practices, and new
              research results in software engineering.<br></br>
            </p>
          </div>
          <div class="home__sigs__container__sig">
            <img src={aiLogo} alt="Artificial Intelligence SIG" />
            <p>
              <br></br>Lorem urna in ac cras sollicitudin integer. Feidn ekd
              ekdno if ejornk kejei ineput. Lorem urna in ac cras foene
              sollicitudin integer.<br></br>
            </p>
          </div>
          <div class="home__sigs__container__sig">
            <img src={cyberLogo} alt="Cyber Security SIG" />
            <p>
              <br></br>Lorem urna in ac cras sollicitudin integer. Feidn ekd
              ekdno if ejornk kejei ineput. Lorem urna in ac cras foene
              sollicitudin integer.<br></br>
            </p>
          </div>
          <div class="home__sigs__container__sig">
            <img src={designLogo} alt="Design SIG" />
            <p>
              <br></br>The ACM Special Interest Group on Design is all about
              design with technology. <br></br>It is committed to advancing the
              skills and knowledge of UI/UX, front-end, design trends, and any
              creative design. <br></br>
            </p>
          </div>
          <div class="home__sigs__container__sig">
            <img src={iotLogo} alt="Internet of Things SIG" />
            <p>
              <br></br>Lorem urna in ac cras sollicitudin integer. Feidn ekd
              ekdno if ejornk kejei ineput. Lorem urna in ac cras foene
              sollicitudin integer.<br></br>
            </p>
          </div>
        </div>
      </section>
      {/* <Leadership /> */}
      <Footer />
    </main>
  );
}

export default Home;
