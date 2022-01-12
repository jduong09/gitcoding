import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import SubscriptionForm from '../subscription/subscriptionForm';

const href = process.env.NODE_ENV === 'production' ? '/auth/logout' : 'http://localhost:5000/auth/logout';

class Dashboard extends React.Component {
  constructor() {
    super();

    this.state = { 
      subscriptions: []
    };
  }

  componentDidMount() {
    // When browser directs user to their dashboard.
    // we want to make an async call to get all their subsacriptions
    fetch(`${window.location.pathname}/subscriptions`).then(data => data.json()).then(response => this.setState({ subscriptions: response }));
  }

  render() {
    const { subscriptions } = this.state;
    
    const subscriptionsList = subscriptions.map((subscription) => (
    <li key={subscription.subscription_uuid}>
      <ul className="subscription-details">
        <li>Name: {subscription.name}</li>
        <li>NickName: {subscription.nickname}</li>
        <li>Due Date: {subscription.due_date}</li>
        <li>Reminder Days: {subscription.reminder_days}</li>
        <li>Amount: {subscription.amount}</li>
      </ul>
    </li>)
    );

    return (
      <div>
        <header>
          <h1>Hello this is the users dashboard page.</h1>
          <section className="subscriptionList">
            <ul>{subscriptionsList}</ul>
          </section>
          <SubscriptionForm />
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