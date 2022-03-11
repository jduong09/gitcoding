import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

const SubscriptionListCard = ({ details, setEditingSubscription, setActiveSubscription, handleDelete }) => {
  const { name, nickname, dueDate, amount, subscriptionUuid } = details;

  return (
    <div className="w-100 p-2 d-flex justify-content-between align-items-center">
      <button className="btn" type="button" onClick={() => setActiveSubscription(details)}>
        <ul className="text-start">
          <li><strong>Name: </strong>{nickname || name}</li>
          <li><strong>Due Date: </strong>{new Date(dueDate.nextDueDate).toLocaleDateString()}</li>
          <li><strong>Amount: </strong>{amount}</li>
        </ul>
      </button>
      <div>
        <button
          className="btn d-none d-md-block"
          type="button"
          onClick={() => setEditingSubscription(details)}
        >
          <FontAwesomeIcon icon={faPen} />
        </button>
        <button
          className="btn d-md-none"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasExample"
          aria-controls="offcanvasExample"
          onClick={() => setEditingSubscription(details)}
          type="button"
          aria-label="Edit">
            <FontAwesomeIcon icon={faPen} />
        </button>
        <button className="btn" onClick={() => handleDelete(subscriptionUuid)} type="button" aria-label="Delete"><FontAwesomeIcon icon={faTrash} /></button>
      </div>
    </div>
  );
};

export default SubscriptionListCard;