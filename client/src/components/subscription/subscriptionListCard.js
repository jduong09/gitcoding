import React, { useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

const SubscriptionListCard = ({ details, setEditingSubscription, setActiveSubscription, handleDelete }) => {
  const { name, nickname, dueDate, amount, subscriptionUuid } = details;

  const handleEdit = useCallback((e) => {
    e.stopPropagation();
    setActiveSubscription(false);
    setEditingSubscription(details);
  }, [setActiveSubscription, setEditingSubscription, details]);

  const clickDelete = useCallback((e) => {
    e.stopPropagation();
    setActiveSubscription(false);
    handleDelete(subscriptionUuid);
  }, [setActiveSubscription, handleDelete, subscriptionUuid]);

  return (
    <div className="w-100 subscriptionListCard d-flex justify-content-between align-items-center">
      <button className="btn w-100 text-start" type="button" onClick={() => setActiveSubscription(details)}>
        <ul>
          <li><strong>Name: </strong>{nickname || name}</li>
          <li><strong>Due Date: </strong>{new Date(dueDate.nextDueDate).toLocaleDateString()}</li>
          <li><strong>Amount: </strong>${amount/100}</li>
        </ul>
      </button>
      <div>
        <button
          className="btn innerButtonEdit d-none d-md-block"
          type="button"
          onClick={handleEdit}
        >
          <FontAwesomeIcon icon={faPen} />
        </button>
        <button
          className="btn innerButtonEdit d-md-none"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasExample"
          aria-controls="offcanvasExample"
          onClick={handleEdit}
          type="button"
          aria-label="Edit">
            <FontAwesomeIcon icon={faPen} />
        </button>
        <button className="btn innerButtonDelete" onClick={clickDelete} type="button" aria-label="Delete"><FontAwesomeIcon icon={faTrash} /></button>
      </div>
      </div>
  );
};

export default SubscriptionListCard;