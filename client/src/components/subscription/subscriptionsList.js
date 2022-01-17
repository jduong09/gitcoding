import React from 'react';
import { toast } from 'react-toastify';
import Subscription from './subscription';
import UpdateSubscription from './updateSubscription';
import CreateSubscription from './createSubscription';

class SubscriptionsList extends React.Component {
  constructor() {
    super();

    this.state = {
      subscriptions: []
    };

    this.handleDelete = this.handleDelete.bind(this);
  }

  async componentDidMount() {
    const allSubscriptions = await fetch(`${window.location.pathname}/subscriptions`);
    const { status } = allSubscriptions;

    if (status === 404) {
      window.location = '/not-found';
    }

    if (status === 400) {
      toast.error('Error: Error getting your subscriptions!');
      return;
    }

    const response = await allSubscriptions.json();
    this.setState({ subscriptions: response });
  }

  handleUpdate = (newSubscriptionsList) => {
    this.setState({ subscriptions: newSubscriptionsList });
  }

  handleDelete = async (subscriptionUuid) => {
    const deleteSubscription = await fetch(`${window.location.pathname}/subscriptions/${subscriptionUuid}`, {
        method: 'DELETE'
    });

    const { status } = deleteSubscription;
    const response = await deleteSubscription.json();
    if (status === 400) {
      const { errorMessage } = response;
      toast.error(errorMessage);
      return;
    }

    toast.success(response);
    
    const { subscriptions } = this.state;
    const updatedSubscriptionsList = await subscriptions.filter(subscription => subscription.subscriptionUuid !== subscriptionUuid);

    this.setState({ subscriptions: updatedSubscriptionsList });
  } 
  
  render() {
    const { subscriptions } = this.state;

    const subscriptionsList = subscriptions.map((subscription) => {
      const { subscriptionUuid } = subscription;
      return (
        <li key={subscriptionUuid}>
          <Subscription details={subscription} />
          <button type="button" onClick={() => this.handleDelete(subscriptionUuid)}>Delete</button>
          <UpdateSubscription updateSubscription={this.handleUpdate} currentSubscriptions={subscriptions} prevSubscription={subscription} />
        </li>
      );
    });

    return (
      <section className="subscription-list">
        <ul>{subscriptionsList}</ul>
        <CreateSubscription addSubscription={this.handleUpdate} currentSubscriptions={subscriptions} />
      </section>
    );
  }
}

export default SubscriptionsList;