import React, { useState } from "react"
import { Card, Button, Alert } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import "../login/Login.scss"
export default function Dashboard() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const history = useHistory()

  async function handleLogout() {
    setError("")

    try {
      await logout()
      history.push("/login")
    } catch {
      setError("Failed to log out")
    }
  }

  return (
    <>

<main className="login">
<div  className="login__landing">
<header>
        <h2>Profile</h2>
        <p>Welcome {currentUser.name}</p>
      </header>


<button onClick={handleLogout}type="logout">Logout</button>
</div>
      {/* <div style={{marginTop:100}}> 
          <h2 className="text-center mb-4">Profile</h2>
          <strong>Email:</strong> {currentUser.email}
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
      </div> */}
      </main>
    </>
  )
}