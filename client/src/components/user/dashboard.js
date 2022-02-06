import React from 'react';
import { toast } from 'react-toastify';
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
      successMessage: '',
    };
  }

  async componentDidMount() {
    // When user logs in and Dashboard is loaded, we want to update their subscription due dates.
    // We also need to know which subscriptions have passed it's due date, in order to notify them that they have late subscriptions.
    try {
      const dueDates = await fetch(`${window.location.pathname}/subscriptions/update`);

      const response = await dueDates.json();

      const { lateDueDates } = response;
      console.log(lateDueDates);
      if (lateDueDates.length === 0) {
        return;
      }

      for (let i = 0; i < lateDueDates.length; i += 1) {
        const { name, date } = lateDueDates[i];
        toast(`Your subscription ${name} was due ${new Date(date).toLocaleDateString()}`);
      }
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