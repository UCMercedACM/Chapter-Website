import "./App.scss";
import { Route, BrowserRouter as Router } from "react-router-dom";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import Home from "./pages/home/Home";
import Events from "./pages/events/Events";
import Sigs from "./pages/sigs/Sigs";
import Resources from "./pages/resources/Resources";
import Login from "./pages/login/Login";

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Route path="/" component={Home} exact />
        <Route path="/events" component={Events} exact />
        <Route path="/sigs" component={Sigs} />
        <Route path="/resources" component={Resources} />
        <Route path="/login" component={Login} />
      </main>
      <Footer />
    </Router>
  );
}

export default App;
