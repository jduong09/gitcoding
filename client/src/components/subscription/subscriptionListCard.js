import React, { useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

<<<<<<< HEAD
const SubscriptionListCard = ({ details, setActiveSubscription, handleDashboard, openDeleteModal }) => {
=======
const SubscriptionListCard = ({ details, setEditingSubscription, setActiveSubscription }) => {
>>>>>>> task/dashboardDesign
  const { name, nickname, dueDate, amount } = details;

  const handleEdit = useCallback((e) => {
    e.stopPropagation();
    setActiveSubscription(details);
    handleDashboard('subscriptionDetail');
    handleDashboard('updateSubscription');
  }, [setActiveSubscription, details, handleDashboard]);

<<<<<<< HEAD
  const clickDelete = useCallback((e) => {
    e.stopPropagation();
    setActiveSubscription(details);
    openDeleteModal();
  }, [setActiveSubscription, details, openDeleteModal]);

  return (
    <div className="w-100 subscriptionListCard d-flex justify-content-between align-items-center">
      <button className="btn w-100" type="button" onClick={() => {
        setActiveSubscription(details);
        handleDashboard('subscriptionDetail');
      }}>
=======
  return (
    <div className="w-100 subscriptionListCard d-flex justify-content-between align-items-center position-relative">
      <button className="btn w-100 active" type="button" onClick={() => setActiveSubscription(details)}>
>>>>>>> task/dashboardDesign
        <ul className="text-start px-0">
          <li><strong>Name: </strong>{nickname || name}</li>
          <li>${amount/100} Due on {new Date(dueDate.nextDueDate).toLocaleDateString()}</li>
        </ul>
      </button>
<<<<<<< HEAD
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
=======
        <div className="position-absolute top-25 end-0">
          <button
            className="btn d-none d-md-block"
            type="button"
            onClick={handleEdit}
          >
>>>>>>> task/dashboardDesign
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