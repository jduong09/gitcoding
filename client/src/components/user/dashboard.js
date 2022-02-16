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
    try {
      const dueDates = await fetch(`${window.location.pathname}/subscriptions/update`);

      const response = await dueDates.json();

      if (response.length === 0) {
        return;
      }

      for (let i = 0; i < response.length; i += 1) {
        const { name, date } = response[i];
        toast(`Your subscription ${name} was due ${new Date(date).toISOString().substring(0, 10)}`);
      }
    } catch(error) {
      toast.error(`Error: ${error}`);
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