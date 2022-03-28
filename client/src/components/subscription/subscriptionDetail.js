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
    <div className="h-90 align-items-start col-11 p-1 d-flex flex-column">
      <div className="col-12 d-flex justify-content-between">
        <div />
        <h2>{nickname || name}</h2>
        <button className="btn" type="button" onClick={() => handleDashboard('dashboardCalendar')}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <div className="col-12 d-flex">
        <ul className="col-6 text-start align-self-center">
          <li><strong>Amount: </strong>${amount/100}</li>
          <li><strong>Next Due Date: </strong>{repeatString}</li>
          <li><strong>Reminder Days: </strong>{reminderDays}</li>
        </ul>
        <div className="col-6" id="dayPickerForm">
          <DetailCalendar dueDate={dueDate}/>
        </div>
      </div>
      <div className="col-10 d-flex justify-content-around mx-auto">
        <div className="col-3">
          <button
            className="btn w-100 btn-primary d-md-none"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasExample"
            aria-controls="offcanvasExample"
            onClick={handleEdit}
          >
            Edit
          </button>
          <button className="btn w-100 btn-primary d-none d-md-block" type="button" onClick={handleEdit}>Edit</button>
        </div>
        <button className="col-3 btn btn-primary" type="button" onClick={clickDelete}>Delete</button>
      </div>
    </div>
  );
};

export default SubscriptionDetail;