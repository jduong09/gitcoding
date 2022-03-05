import React from 'react';
import SubscriptionListCard from './subscriptionListCard';

const NewSubscriptionsList = ({ subscriptions, setEditingSubscription, setAddingSubscription, handleDelete }) => {
  const subscriptionsList = subscriptions.map((subscription) => {
    const { subscriptionUuid } = subscription;
    return (
      <li className="list-group-item" key={subscriptionUuid} >
        <SubscriptionListCard 
          details={subscription} 
          setEditingSubscription={setEditingSubscription}
          handleDelete={handleDelete}
        />
      </li>
    );
  });

  return (
    <ul className="list-group">
      {subscriptionsList}
      <li><button type="button" onClick={() => setAddingSubscription(true)}>+Create</button></li>
    </ul>
  );
};

export default NewSubscriptionsList;