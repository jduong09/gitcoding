import React, { useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

const SubscriptionListCard = ({ details, setActiveSubscription, handleDashboard, handleDelete }) => {
  const { name, nickname, dueDate, amount, subscriptionUuid } = details;

  const handleEdit = useCallback((e) => {
    e.stopPropagation();
    setActiveSubscription(details);
    // moving from one updateForm to a next, requires setting mainComponentView state from updateSubscription -> subscriptionDetail -> updateSubscription
    handleDashboard('subscriptionDetail');
    handleDashboard('updateSubscription');
  }, [setActiveSubscription, details, handleDashboard]);

  const clickDelete = useCallback((e) => {
    e.stopPropagation();
    handleDelete(subscriptionUuid);
  }, [handleDelete, subscriptionUuid]);

  return (
    <div className="w-100 subscriptionListCard d-flex justify-content-between align-items-center">
      <button className="btn w-100" type="button" onClick={() => {
        setActiveSubscription(details);
        handleDashboard('subscriptionDetail');
      }}>
        <ul className="text-start px-0">
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
          onClick={() => setActiveSubscription(details)}
          type="button"
          aria-label="Edit">
            <FontAwesomeIcon icon={faPen} />
        </button>
        <button className="btn innerButtonDelete" data-bs-toggle="modal" data-bs-target="#deleteModal" onClick={clickDelete} type="button" aria-label="Delete"><FontAwesomeIcon icon={faTrash} /></button>
      </div>
      </div>
  );
};

export default SubscriptionListCard;