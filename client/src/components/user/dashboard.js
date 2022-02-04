import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import SubscriptionsList from '../subscription/subscriptionsList';

const href = process && process.env && process.env.NODE_ENV === 'production'
  ? '/auth/logout'
  : 'http://localhost:5000/auth/logout';

class Dashboard extends React.Component {
  constructor() {
    super();

    this.state = { 
      successMessage: ''
    };
  }

  async componentDidMount() {
    try {
      await fetch(`${window.location.pathname}/subscriptions/update`); 
    } catch(error) {
      console.log('Error: ', error);
    }
  }

  render() {
    const { successMessage } = this.state;
    return (
      <div>
        <header>
          <h1>Hello this is the users dashboard page.</h1>
          <section className="subscription-list">
            <SubscriptionsList />
          </section>
          {successMessage}
          <a href={href}>
            Sign Out!
            <FontAwesomeIcon icon={faSignOutAlt} />
          </a>
        </header>
      </div>
    );
  }
};

export default Dashboard;