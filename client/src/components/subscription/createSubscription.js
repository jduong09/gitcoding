import React from 'react';
import { toast } from 'react-toastify';
import SubscriptionForm from './subscriptionForm';

class CreateSubscription extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubscriptions = this.handleSubscriptions.bind(this);
  }

  async handleSubscriptions(subscription) {
    const { addSubscription, currentSubscriptions } = this.props;
    const newSubscriptionList = [ ...currentSubscriptions, subscription];
    addSubscription(newSubscriptionList);
    toast.success('Successfully created subscription!');
  }

  render() {
    const { toggleLoadingState, showSubscriptionList } = this.props;
    return (
      <SubscriptionForm 
        method="PUT"
        toggleLoadingState={toggleLoadingState}
        showSubscriptionList={showSubscriptionList}
        handleSubscriptions={this.handleSubscriptions} />
    );
  }
};

export default CreateSubscription;