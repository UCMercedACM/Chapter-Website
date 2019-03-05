/* eslint-disable no-unused-expressions */
import React from "react";

import * as ROLES from "../../constants/roles";
import { withAuthorization } from "../Session";

const AdminPage = () => {
  <div>
    <h1>Admin</h1>
    <p>Restricted area! Only users with the admin role are authorized.</p>
  </div>;
};

const condition = authUser => authUser && authUser.roles.includes(ROLES.ADMIN);
export default withAuthorization(condition)(AdminPage);
