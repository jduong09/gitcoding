import React, { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { parseWeeklyDates, parseMonthlyDates } from '../../utils/frontendDateUtils';
import DetailCalendar from '../date/detailCalendar';

const SubscriptionDetail = ({ setActiveSubscription, handleDashboard, details, openDeleteModal }) => {
  const { name, nickname, dueDate, reminderDays, amount } = details;

  const [repeatString, setRepeatString] = useState('');

  useEffect(() => {
    let parsedRepeatString;

    if (dueDate.frequency === 'weekly') {
      parsedRepeatString = (dueDate.occurrence > 1)
        ? `Every ${dueDate.occurrence} weeks on ${parseWeeklyDates(dueDate.dates)}.`
        : `Every week on ${parseWeeklyDates(dueDate.dates)}.`;
    } else if (dueDate.frequency === 'monthly') {
      parsedRepeatString = (dueDate.occurrence > 1)
        ? `Every ${dueDate.occurrence} months on ${parseMonthlyDates(dueDate.dates)}.`
        : `Every month on ${parseMonthlyDates(dueDate.dates)}.`;
    } else if (dueDate.frequency === 'daily') {
      parsedRepeatString = (dueDate.occurrence > 1)
        ? `Every ${dueDate.occurrence} days.`
        : 'Every day.';
    } else {
      parsedRepeatString = 'Every year.';
    }

    setRepeatString(`${new Date(dueDate.nextDueDate).toLocaleDateString()}, ${parsedRepeatString}`);
  }, [name, dueDate]);

  const handleClose = useCallback((e) => {
    e.stopPropagation();
    handleDashboard('dashboardCalendar');
  }, [handleDashboard]);

  const handleEdit = useCallback((e) => {
    e.stopPropagation();
    setActiveSubscription(details);
    handleDashboard('updateSubscription');
  }, [setActiveSubscription, details, handleDashboard]);

  const clickDelete = useCallback((e) => {
    e.stopPropagation();
    setActiveSubscription(details);
    openDeleteModal();
  }, [setActiveSubscription, details, openDeleteModal]);

  return (
    <div className="col-12 p-3 d-flex flex-column">
      <div className="col-12 d-flex justify-content-between">
        <h2>{nickname || name}</h2>
        <button className="btn" type="button" onClick={handleClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <div className="col-12 col-md-6 dayPickerBorder">
        <div className="text-center" id="dayPickerForm">
            <DetailCalendar dueDate={dueDate}/>
        </div>
      </div>
      <div className="col-12">
        <ul className="col-12 p-1 text-start">
          {nickname && <li className="d-flex flex-column"><strong>Name: </strong><span>{name}</span></li>}
          <li className="d-flex flex-column"><strong>Amount</strong><span>${amount/100}</span></li>
          <li className="d-flex flex-column"><strong>Next Due Date</strong><span>{repeatString}</span></li>
          <li className="d-flex flex-column"><strong>Alert</strong><span>{reminderDays} day(s) before due date</span></li>
        </ul>
      </div>
      <div className="col-10 d-flex justify-content-around mx-auto">
          <div className="col-3">
            <button
              className="btn btn-primary w-100 d-md-none"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasExample"
              aria-controls="offcanvasExample"
              onClick={handleEdit}
            >
              Edit
            </button>
            <button className="btn btn-primary w-100 d-none d-md-block" type="button" onClick={handleEdit}>Edit</button>
          </div>
          <button className="col-3 btn btn-primary" id="btn-subscription-delete" type="button" onClick={clickDelete}>Delete</button>
        </div>
    </div>
  );
};

export default SubscriptionDetail;