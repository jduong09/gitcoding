import React, { useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

const SubscriptionListCard = ({ details, setActiveSubscription, setEditingSubscription, handleDashboard }) => {
  const { name, nickname, dueDate, amount } = details;

  const handleEdit = useCallback(async (e) => {
    e.stopPropagation();
    await setEditingSubscription(details);
    handleDashboard('updateSubscription');
  }, [setEditingSubscription, details, handleDashboard]);

  return (
    <div className="w-100 subscriptionListCard d-flex justify-content-between align-items-center">
      <button className="btn w-100" type="button" onClick={async () => {
        await setActiveSubscription(details);
        handleDashboard('subscriptionDetail');
      }}>
        <ul className="text-start px-0">
          <li><strong>Name: </strong>{nickname || name}</li>
          <li>${amount/100} Due on {new Date(dueDate.nextDueDate).toLocaleDateString()}</li>
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
          className="btn d-md-none"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasExample"
          aria-controls="offcanvasExample"
          onClick={handleEdit}
          type="button"
          aria-label="Edit">
            <FontAwesomeIcon icon={faPen} />
        </button>
      </div>
    </div>
  );
};

export default SubscriptionListCard;