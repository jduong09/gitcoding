import React from 'react';
import { toast } from 'react-toastify';
import SubscriptionForm from './subscriptionForm';

const UpdateSubscription = ({ updateSubscription, prevSubscription }) => {
  

  const handleSubscriptions = async () => {
    const newSubscriptionList = await fetch(`${window.location.pathname}/subscriptions`); 
    const { status } = newSubscriptionList;
    const response = await newSubscriptionList.json();
    if (status === 400) {
      toast.error('Error: Error fetching your updated subscription!');
      return;
    }

    updateSubscription(response);
    toast.success('Successfully updated subscription!');
  };

  return (
    <SubscriptionForm method="PATCH" prevSubscription={prevSubscription} handleSubscriptions={handleSubscriptions} />
  );
};

export default UpdateSubscription;