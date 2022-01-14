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
      updatedSubscription: false,
      successMessage: ''
    };

    this.updateSubscriptions = this.updateSubscriptions.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async componentDidMount() {
    // When browser directs user to their dashboard.
    // we want to make an async call to get all their subsacriptions
    await fetch(`${window.location.pathname}/subscriptions`).then(data => data.json()).then(response => this.setState({ subscriptions: response }));
  }

  updateSubscriptions = (newSubscriptionList) => {
    this.setState({ subscriptions: newSubscriptionList, updatedSubscription: false });
  }

  handleUpdate = (subscriptions) => {
    this.setState({ updatedSubscription: subscriptions });
  }

  handleDelete = async (subscription_uuid) => {
    let newSubscriptions;

    try {
      newSubscriptions = await fetch(`${window.location.pathname}/subscriptions/${subscription_uuid}`, {
        method: 'DELETE'
      }).then(() => {
        const { subscriptions } = this.state;
        return subscriptions.filter(subscription => subscription.subscription_uuid !== subscription_uuid);
      });
    } catch(error) {
      alert('ERROR DELETING SUBSCRIPTION: ', error);
    }

    this.setState({ subscriptions: newSubscriptions });
  } 

  render() {
    const { subscriptions, updatedSubscription, successMessage } = this.state;
    
    const subscriptionsList = subscriptions.map((subscription) => {
      const { subscription_uuid } = subscription;
      return (
        <li key={subscription_uuid}>
          <Subscription details={subscription} />
          <button type="button" onClick={() => this.handleUpdate(subscription)}>Update</button>
          <button type="button" onClick={() => this.handleDelete(subscription_uuid)}>Delete</button>
        </li>
      );
    });

    return (
      <div>
        <header>
          <h1>Hello this is the users dashboard page.</h1>
          <section className="subscription-list">
            <ul>{subscriptionsList}</ul>
          </section>
          {successMessage}
          <SubscriptionForm performUpdate={updatedSubscription} updateSubscriptions={this.updateSubscriptions} currentSubscriptions={subscriptions} />
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