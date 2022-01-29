import React from 'react';
import { toast } from 'react-toastify';
import SubscriptionForm from './subscriptionForm';

const CreateSubscription = ({ addSubscription, currentSubscriptions }) => {
  const handleSubscriptions = async (subscription) => {
    const newSubscriptionList = [ ...currentSubscriptions, subscription];
    addSubscription(newSubscriptionList);
    toast.success('Successfully created subscription!');
  };

  return (
    <SubscriptionForm method="PUT" handleSubscriptions={handleSubscriptions}/>
  );
};

export default CreateSubscription;