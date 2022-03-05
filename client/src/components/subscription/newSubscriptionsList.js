import React from 'react';
import SubscriptionListCard from './subscriptionListCard';

const NewSubscriptionsList = ({ subscriptions, setEditingSubscription }) => {
  const subscriptionsList = subscriptions.map((subscription) => {
    const { subscriptionUuid } = subscription;
    return <li className="list-group-item" key={subscriptionUuid} ><SubscriptionListCard details={subscription} setEditingSubscription={setEditingSubscription} /></li>;
  });

  return (
    <ul className="list-group">
      {subscriptionsList}
    </ul>
  );
};

export default NewSubscriptionsList;