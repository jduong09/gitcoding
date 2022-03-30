import React from 'react';
import { toast } from 'react-toastify';
import SubscriptionForm from './subscriptionForm';

const UpdateSubscription = ({ updateSubscription, prevSubscription, showSubscriptionList, toggleLoadingState, closeOffcanvas }) => {
  const handleSubscriptions = async () => {
    toggleLoadingState();
    const newSubscriptionList = await fetch(`${window.location.pathname}/subscriptions`); 
    const { status } = newSubscriptionList;
    const response = await newSubscriptionList.json();
    toggleLoadingState();
    if (status === 400) {
      toast.error('Error: Error fetching your updated subscription!');
      return;
    }

    updateSubscription(response);
    toast.success('Successfully updated your subscription!');
  };

  return (
    <SubscriptionForm
      method="PATCH"
      prevSubscription={prevSubscription}
      handleSubscriptions={handleSubscriptions}
      showSubscriptionList={showSubscriptionList}
      toggleLoadingState={toggleLoadingState}
      closeOffcanvas={closeOffcanvas}
    />
  );
};

export default UpdateSubscription;