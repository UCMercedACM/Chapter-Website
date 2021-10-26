import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import "../login/Login.scss";

export default function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  async function handleLogout() {
    setError("");

    try {
      await logout();
      history.push("/login");
    } catch (err) {
      console.log(err);
      setError("Failed to log out");
    }
  }

  return (
    <>
      <main className="login">
        <div className="login__landing">
          <header>
            <h2>Profile</h2>
            <p>Welcome {currentUser.name}</p>
          </header>

          <button onClick={handleLogout} type="logout">
            Logout
          </button>
          {error && <p>{error}</p>}
        </div>
      </main>
    </>
  );
}
