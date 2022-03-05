import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

const SubscriptionListCard = ({ details, setEditingSubscription }) => {
  const { name, nickname, dueDate, amount } = details;

  return (
    <div className="d-flex">
      <ul>
        <li><strong>Name:</strong>{nickname || name}</li>
        <li><strong>Due Date:</strong>{new Date(dueDate.nextDueDate).toLocaleDateString()}</li>
        <li><strong>Amount:</strong>{amount}</li>
      </ul>
      <button onClick={() => setEditingSubscription(details)} type="button" aria-label="Edit"><FontAwesomeIcon icon={faPen} /></button>
      <button onClick={() => alert('clicked delete')} type="button" aria-label="Delete"><FontAwesomeIcon icon={faTrash} /></button>
    </div>
  );
};

export default SubscriptionListCard;