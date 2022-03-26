import React from 'react';
import SubscriptionListCard from './subscriptionListCard';

const SubscriptionsList = ({ subscriptions, setEditingSubscription, setActiveSubscription, handleDelete }) => {
  const subscriptionsList = subscriptions.map((subscription) => {
    const { subscriptionUuid } = subscription;
    return (
      <li 
        className="list-group-item p-0 mt-2 list-group-item-action border border-dark rounded-1"
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
      <ul className="list-group">
        {subscriptionsList}
      </ul>
    </div>
  );
};

export default SubscriptionsList;