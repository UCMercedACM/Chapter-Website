import React from "react";
import "./Header.scss";
import { NavLink } from "react-router-dom";

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
            <NavLink to="/" className="inactive" activeClassName="active" exact>
              HOME
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/events"
              className="inactive"
              activeClassName="active"
              exact
            >
              EVENTS
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/sigs"
              className="inactive"
              activeClassName="active"
              exact
            >
              SIGS
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/resources"
              className="inactive"
              activeClassName="active"
              exact
            >
              RESOURCES
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/login"
              className="inactive"
              activeClassName="active"
              exact
            >
              LOGIN
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
