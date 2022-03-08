import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

const SubscriptionListCard = ({ details, setEditingSubscription, setActiveSubscription, handleDelete }) => {
  const { name, nickname, dueDate, amount, subscriptionUuid } = details;

  return (
    <button className="btn w-100 p-2 d-flex justify-content-between align-items-center" onClick={() => setActiveSubscription(details)} type="button">
      <ul className="text-start">
        <li><strong>Name: </strong>{nickname || name}</li>
        <li><strong>Due Date: </strong>{new Date(dueDate.nextDueDate).toLocaleDateString()}</li>
        <li><strong>Amount: </strong>{amount}</li>
      </ul>
      <div>
        <button
          className="btn"
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
    </button>
  );
};

export default SubscriptionListCard;