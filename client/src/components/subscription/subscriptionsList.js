import React from 'react';
import SubscriptionListCard from './subscriptionListCard';

const SubscriptionsList = ({ subscriptions, setEditingSubscription, handleDashboard, activeSubscription, openOffcanvas }) => {
  const subscriptionsList = subscriptions.map((subscription) => {
    const { subscriptionUuid } = subscription;
    let className="list-group-item p-0 mt-2 list-group-item-action border border-dark rounded-1";
    if (activeSubscription.subscriptionUuid === subscriptionUuid) {
      className += " activeCard";
    }

    return (
      <li 
        className={className}
        key={subscriptionUuid}
      >
        <SubscriptionListCard 
          details={subscription}
          setEditingSubscription={setEditingSubscription}
          handleDashboard={handleDashboard}
          openOffcanvas={openOffcanvas}
        />
      </li>
    );
  });

  return (
    <div>
      <h2 className="text-start">Subscriptions</h2>
      <ul className="list-group" id="list-subscriptions">
        {subscriptionsList}
      </ul>
    </div>
  );
};

export default SubscriptionsList;