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
    <div>
      <ul className="list-group">
        {subscriptionsList}
      </ul>
      <button className="col-12 btn border-dashed border-primary text-primary" type="button" onClick={() => setAddingSubscription(true)}>+Create</button>
    </div>
  );
};

export default NewSubscriptionsList;