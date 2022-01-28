import React from 'react';
import SubscriptionForm from './subscriptionForm';

const CreateSubscription = ({ addSubscription, currentSubscriptions }) => {
  const handleSubscriptions = async (subscription) => {
    const newSubscriptionList = [ ...currentSubscriptions, subscription];
    addSubscription(newSubscriptionList);
  };

  return (
    <SubscriptionForm method="PUT" handleSubscriptions={handleSubscriptions}/>
  );
};

export default CreateSubscription;