import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import SubscriptionForm from '../subscription/subscriptionForm';

const href = process.env.NODE_ENV === 'production' ? '/auth/logout' : 'http://localhost:5000/auth/logout';

const Dashboard = () => (
  <div>
    <header>
      <h1>Hello this is the users dashboard page.</h1>
      <SubscriptionForm />
      <a href={href}>
        Sign Out!
        <FontAwesomeIcon icon={faSignOutAlt} />
      </a>
    </header>
  </div>
);

export default Dashboard;