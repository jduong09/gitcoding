import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import SubscriptionForm from '../subscription/subscriptionForm';
import Subscription from '../subscription/subscription';

const href = process.env.NODE_ENV === 'production' ? '/auth/logout' : 'http://localhost:5000/auth/logout';

class Dashboard extends React.Component {
  constructor() {
    super();

    this.state = { 
      subscriptions: [],
      updatedSubscription: false
    };

    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    // When browser directs user to their dashboard.
    // we want to make an async call to get all their subsacriptions
    fetch(`${window.location.pathname}/subscriptions`).then(data => data.json()).then(response => this.setState({ subscriptions: response }));
  }

  handleUpdate = (subscription) => {
    this.setState({ updatedSubscription: subscription });
  }

  handleDelete = async (subscription_uuid) => {
    try {
      await fetch(`${window.location.pathname}/subscriptions/${subscription_uuid}`, {
        method: 'DELETE'
      }).then(() => alert('SUCCESSFULLY DELETED SUBSCRIPTION'));
    } catch(error) {
      alert('ERROR DELETING SUBSCRIPTION: ', error);
    }
  } 

  render() {
    const { subscriptions, updatedSubscription } = this.state;
    
    const subscriptionsList = subscriptions.map((subscription) => {
      const { subscription_uuid } = subscription;
      return (
        <li key={subscription_uuid}>
          <Subscription details={subscription} />
          <button type="button" onClick={() => this.handleUpdate(subscription)}>Update</button>
          <button type="button" onClick={() => this.handleDelete(subscription_uuid)}>Delete</button>
        </li>
      )
    });

    return (
      <div>
        <header>
          <h1>Hello this is the users dashboard page.</h1>
          <section className="subscription-list">
            <ul>{subscriptionsList}</ul>
          </section>
          <SubscriptionForm performUpdate={updatedSubscription} />
          <a href={href}>
            Sign Out!
            <FontAwesomeIcon icon={faSignOutAlt} />
          </a>
        </header>
      </div>
    )
  }
};

export default Dashboard;