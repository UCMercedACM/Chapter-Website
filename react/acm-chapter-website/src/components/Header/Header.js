import React, { useState } from "react";
import "../../sass/components/Header.scss";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import acmLogo from "../../assets/images/acm_logo_v2.png";
import { auth } from "../../firebase/config";

export default function Header() {
  const { currentUser } = useAuth();

  const [isActive, setIsActive] = useState(false);
  const handleToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <header className="page-header">
      <div className="page-header__content">
        <img src={acmLogo} alt="ACM Logo" className="page-header__logo" />
        <nav>
          <div className="page-header__links">
            <NavLink 
              to="/" 
              className="page-header__link page-header__link--inactive" 
              activeClassName="page-header__link page-header__link--active" 
              exact
            >
              Home
            </NavLink>

            <NavLink
              to="/events"
              className="page-header__link page-header__link--inactive"
              activeClassName="page-header__link page-header__link--active"
              exact
            >
              Events
            </NavLink>

            <NavLink
              to="/sigs"
              className="page-header__link page-header__link--inactive"
              activeClassName="page-header__link page-header__link--active"
              exact
            >
              SIGS
            </NavLink>

            {!currentUser ? (
              <NavLink
                to="/login"
                className="page-header__link page-header__link--inactive"
                activeClassName="page-header__link page-header__link--active"
                exact
              >
                Login
              </NavLink>
            ) : null}
            {!currentUser ? (
              <NavLink
                to="/register"
                className="page-header__link page-header__link--inactive"
                activeClassName="page-header__link page-header__link--active"
                exact
              >
                Register
              </NavLink>
            ) : null}
            {currentUser ? (
              <NavLink
                to="/dashboard"
                className="page-header__link page-header__link--inactive"
                activeClassName="page-header__link page-header__link--active"
                exact
              >
                Dashboard
              </NavLink>
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
          </div>
        </nav>
        </div>
    </header>
  );
}
