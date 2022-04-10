import React from 'react';
import { toast } from 'react-toastify';
import SubscriptionForm from './subscriptionForm';

const CreateSubscription = ({ toggleLoadingState, addSubscription, currentSubscriptions, showSubscriptionList, closeOffcanvas }) => {
  const handleSubscriptions = async (subscription) => {
    const newSubscriptionList = [ ...currentSubscriptions, subscription];
    toggleLoadingState();
    await addSubscription(newSubscriptionList);
    toast.success('Successfully created subscription!');
  };

  return (
    <SubscriptionForm 
      method="PUT"
      toggleLoadingState={toggleLoadingState}
      showSubscriptionList={showSubscriptionList}
      handleSubscriptions={handleSubscriptions}
      closeOffcanvas={closeOffcanvas}
      />
  );
};

export default CreateSubscription;