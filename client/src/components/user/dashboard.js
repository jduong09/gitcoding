import React from 'react';
// import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
// import { DateUtils } from 'react-day-picker';
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

  /*
  async componentDidMount() {
    try {
      await fetch(`${window.location.pathname}/subscriptions/update`);
      const allSubs = await fetch(`${window.location.pathname}/subscriptions`);

      const response = await allSubs.json();

      for (let i = 0; i < response.length; i += 1) {
        const subscription = response[i];
        const { dueDate, name } = subscription;

        if (dueDate.lateDueDate) {
          toast.error(`Your subscription ${name} was due ${new Date(dueDate.lateDueDate).toLocaleDateString()}`, {
            autoClose: false,
            style: { backgroundColor: 'red', color: '#000000' }
          });
        } else if (DateUtils.isSameDay(new Date(dueDate.nextDueDate), new Date()) && !dueDate.lateDueDate) {
          toast(`Your ${name} subscription is due!`, {
            autoClose:false,
            style: {
              backgroundColor: '#8C7AE6',
              color: '#000000'
            }
          });
        }
      }
      // const dueDates = await fetch(`${window.location.pathname}/subscriptions/update`);

      // const response = await dueDates.json();

      /*
      if (response.length === 0) {
        return;
      }

      for (let i = 0; i < response.length; i += 1) {
        const { name, date } = response[i];

        toast.error(`Your subscription ${name} was due ${new Date(date).toISOString().substring(0, 10)}`, {
          autoClose: false,
          style: { backgroundColor: 'red', color: '#000000' }
        });
      }
    } catch(error) {
      toast.error(`Error: ${error}`);
    }
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