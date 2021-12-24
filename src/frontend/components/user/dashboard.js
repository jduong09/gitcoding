import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => (
  <div>
    <header>
      <h1>Hello this is the users dashboard page.</h1>
      <a href="http://localhost:5000/auth/logout">
        Sign Out!
        <FontAwesomeIcon icon={faSignOutAlt} />
      </a>
    </header>
  </div>
);

export default Dashboard;