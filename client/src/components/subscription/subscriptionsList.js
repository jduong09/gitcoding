import React from 'react';
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
    await fetch(`${window.location.pathname}/subscriptions`)
      .then(data => data.json())
      .then(response => this.setState({ subscriptions: response }));
  }

  handleUpdate = (newSubscriptionsList) => {
    this.setState({ subscriptions: newSubscriptionsList });
  }

  handleDelete = async (subscriptionUuid) => {
    let newSubscriptionList;

    try {
      newSubscriptionList = await fetch(`${window.location.pathname}/subscriptions/${subscriptionUuid}`, {
        method: 'DELETE'
      }).then(() => {
        const { subscriptions } = this.state;
        return subscriptions.filter(subscription => subscription.subscriptionUuid !== subscriptionUuid);
      });
    } catch(error) {
      console.log('Error deleting subscription: ', error);
    }

    this.setState({ subscriptions: newSubscriptionList });
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