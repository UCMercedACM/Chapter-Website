import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Home from "../Home";
import * as ROUTES from "../../constants/routes";

const App = () => (
  <Router>
    <div>
      <Route exact path={ROUTES.HOME} component={Home} />
    </div>
  </Router>
);

export default App;
