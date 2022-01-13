import React, { useState } from "react";
import "./Header.scss";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import acmLogo from "../../assets/images/acm_logo_v2.png";

export default function Header() {
  const { currentUser } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const history = useHistory();

  return (
    <header class="navbar">
      <img
        src={acmLogo}
        alt="ACM Logo"
        class="navbar__logo"
        onClick={history.push("/")}
      />
      <nav>
        <ul class="navbar__links">
          <li>
            <NavLink to="/" className="inactive" activeClassName="active" exact>
              Home 
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/events"
              className="inactive"
              activeClassName="active"
              exact
            >
              Events
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
          {!currentUser ? (
            <li>
              <NavLink
                to="/login"
                className="inactive"
                activeClassName="active"
                exact
              >
                Login
              </NavLink>
            </li>
          ) : null}
          {!currentUser ? (
            <li>
              <NavLink
                to="/register"
                className="inactive"
                activeClassName="active"
                exact
              >
                Register
              </NavLink>
            </li>
          ) : null}
          {currentUser ? (
            <li>
              <NavLink
                to="/dashboard"
                className="inactive"
                activeClassName="active"
                exact
              >
                Dashboard
              </NavLink>
            </li>
          ) : null}
          <div
            id="nav-icon"
            onClick={handleToggle}
            className={`toggle inactive ${isActive ? "open" : ""}`}
          >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </ul>
      </nav>
    </header>
  );
}
