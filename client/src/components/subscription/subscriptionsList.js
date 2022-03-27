import React from 'react';
import SubscriptionListCard from './subscriptionListCard';

const SubscriptionsList = ({ subscriptions, setActiveSubscription, handleDashboard, handleDelete, openDeleteModal }) => {
  const subscriptionsList = subscriptions.map((subscription) => {
    const { subscriptionUuid } = subscription;
    return (
      <li 
        className="list-group-item p-0 mt-2 list-group-item-action border border-dark rounded-1"
        key={subscriptionUuid}
      >
        <SubscriptionListCard 
          details={subscription}
          setActiveSubscription={setActiveSubscription}
          handleDashboard={handleDashboard}
          handleDelete={handleDelete}
          openDeleteModal={openDeleteModal}
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