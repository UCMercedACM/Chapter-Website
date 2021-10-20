import React from "react";
import "./Header.scss";

const Header = () => {
  return (
    <header class="navbar">
      <img
        src="assets/images/acm_logo_v2.png"
        alt="ACM Logo"
        class="navbar__logo"
      />
      <nav>
        <ul class="navbar__links">
          <li>
            <a href="/">HOME</a>
            <div class="bar"></div>
          </li>
          <li>
            <a href="/events">EVENTS</a>
            <div class="bar"></div>
          </li>
          <li>
            <a href="/sigs">SIGS</a>
            <div class="bar"></div>
          </li>
          <li>
            <a href="/resources">RESOURCES</a>
            <div class="bar"></div>
          </li>
          <li>
            <a href="/login">MEMBER LOGIN</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
