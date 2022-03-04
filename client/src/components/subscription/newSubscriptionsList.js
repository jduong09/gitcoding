import React from 'react';
import { toast } from 'react-toastify';
import { DateUtils } from 'react-day-picker';
import SubscriptionListCard from './subscriptionListCard';

class NewSubscriptionsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subscriptions: []
    };
  };

  async componentDidMount() {
    const { updateDueDates } = this.props;
    const data = await fetch(`${window.location.pathname}/subscriptions`);
    const { status } = data;

    if (status === 404) {
      window.location = '/not-found';
    }

    if (status === 400) {
      toast.error('Error: Error getting your subscriptions!');
      return;
    }
    const subscriptions = await data.json();
    const dueDates = [];

    for (let i = 0; i < subscriptions.length; i += 1) {
      const subscription = subscriptions[i];
      const { dueDate, name } = subscription;

      if (dueDate.lateDueDate) {
        toast.error(`Your ${name} subscription was due on ${new Date(dueDate.lateDueDate).toLocaleDateString()}`, {
          autoClose: false,
          style: { backgroundColor: 'red', color: '#000000' }
        });
      } else if (DateUtils.isSameDay(new Date(dueDate.nextDueDate), new Date()) && !dueDate.lateDueDate) {
        toast(`Your ${name} subscription is due today!`, {
          autoClose:false,
          style: {
            backgroundColor: '#8C7AE6',
            color: '#000000'
          }
        });
      }
      dueDates.push(new Date(dueDate.nextDueDate));
    };

    updateDueDates(dueDates);

    this.setState({ subscriptions });
  };

  render() {
    const { subscriptions } = this.state;
    const subscriptionsList = subscriptions.map((subscription) => {
      const { subscriptionUuid } = subscription;
      return <li className="list-group-item" key={subscriptionUuid} ><SubscriptionListCard details={subscription} /></li>;
    });

    return (
      <ul className="list-group">
        {subscriptionsList}
      </ul>
    );
  };
};

export default NewSubscriptionsList;