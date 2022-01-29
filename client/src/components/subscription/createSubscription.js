import React from 'react';
import { toast } from 'react-toastify';
import SubscriptionForm from './subscriptionForm';

const CreateSubscription = ({ addSubscription, currentSubscriptions, showSubscriptionList, toggleLoadingState }) => {
  const handleSubscriptions = async (subscription) => {
    const newSubscriptionList = [ ...currentSubscriptions, subscription];
    addSubscription(newSubscriptionList);
    toast.success('Successfully created subscription!');
  };

  return (
    <SubscriptionForm method="PUT" handleSubscriptions={handleSubscriptions} showSubscriptionList={showSubscriptionList} toggleLoadingState={toggleLoadingState} />
  );
};

export default CreateSubscription;