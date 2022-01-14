import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import SubscriptionsList from '../subscription/subscriptionsList';

const href = process.env.NODE_ENV === 'production' ? '/auth/logout' : 'http://localhost:5000/auth/logout';

class Dashboard extends React.Component {
  constructor() {
    super();

    this.state = { 
      // updatedSubscription: false,
      successMessage: ''
    };

    // this.updateSubscriptions = this.updateSubscriptions.bind(this);
    // this.handleUpdate = this.handleUpdate.bind(this);
  }

  /*
  updateSubscriptions = (newSubscriptionList) => {
    this.setState({ subscriptions: newSubscriptionList, updatedSubscription: false });
  }
  */

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