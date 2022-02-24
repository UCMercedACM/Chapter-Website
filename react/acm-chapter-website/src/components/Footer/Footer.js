import React from "react";
import "../../sass/components/Footer.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faTwitter,
  faDiscord,
  faInstagram,
  faFacebook,
  faSlack,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            width="100"
            height="100"
            fill="#00e1bfcc"
            fillOpacity="1"
            d="M0,96L80,80C160,64,320,32,480,53.3C640,75,800,149,960,154.7C1120,160,1280,96,1360,64L1440,32L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          ></path>
        </svg>
        <div className="footer__wave__bottom-padding"></div>
      </div>
      <div className="footer__container">
        <nav className="footer__container__navigation">
          <button className="footer__container__navigation__social">
            <a
              href="https://www.linkedin.com/company/association-of-computing-machinery-at-uc-merced/"
              // target="_blank"
              className="footer__container__navigation__social__link"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </button>
          <button className="footer__container__navigation__social">
            <a
              href="https://twitter.com/ucmercedacm"
              // target="_blank"
              className="footer__container__navigation__social__link"
            >
              <FontAwesomeIcon icon={faTwitter} />
            </a>
          </button>
          <button className="footer__container__navigation__social">
            <a
              href="https://www.instagram.com/ucmacm/"
              // target="_blank"
              className="footer__container__navigation__social__link"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </button>
          <button className="footer__container__navigation__social">
            <a
              href="https://www.facebook.com/groups/ucmercedacm/"
              // target="_blank"
              className="footer__container__navigation__social__link"
            >
              <FontAwesomeIcon icon={faFacebook} />
            </a>
          </button>
          <button className="footer__container__navigation__social">
            <a
              href="https://github.com/UCMercedACM"
              // target="_blank"
              className="footer__container__navigation__social__link"
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>
          </button>
          <button className="footer__container__navigation__social">
            <a
              href="https://acm-ucm-discord"
              // target="_blank"
              className="footer__container__navigation__social__link"
            >
              <FontAwesomeIcon icon={faDiscord} />
            </a>
          </button>
          <button className="footer__container__navigation__social">
            <a
              href="https://bit.ly/acm-ucm-slack"
              // target="_blank"
              className="footer__container__navigation__social__link"
            >
              <FontAwesomeIcon icon={faSlack} />
            </a>
          </button>
        </nav>
        <div className="footer__container__copyright">
          <fa-icon></fa-icon> Copyright {new Date().getFullYear()}
        </div>
        <div className="footer__container__credits">
          Written and coded with love by ACM @ UCM
        </div>
      </div>
    </footer>
  );
};

export default Footer;
