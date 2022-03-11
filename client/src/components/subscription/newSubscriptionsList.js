import React from 'react';
import SubscriptionListCard from './subscriptionListCard';

const NewSubscriptionsList = ({ subscriptions, setEditingSubscription, setActiveSubscription, handleDelete }) => {
  const subscriptionsList = subscriptions.map((subscription) => {
    const { subscriptionUuid } = subscription;
    return (
      <li 
        className="list-group-item p-0 list-group-item-action border-bottom border-dark"
        key={subscriptionUuid}
      >
        <SubscriptionListCard 
          details={subscription}
          setEditingSubscription={setEditingSubscription}
          setActiveSubscription={setActiveSubscription}
          handleDelete={handleDelete}
        />
      </li>
    );
  });

  return (
    <div>
      <h2 className="text-start">Subscriptions</h2>
      <ul className="list-group border-bottom-0 border-dark">
        {subscriptionsList}
      </ul>
    </div>
  );
};

export default NewSubscriptionsList;