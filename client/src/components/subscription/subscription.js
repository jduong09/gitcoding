import React, { useEffect, useState } from 'react';
import { parseWeeklyDates, parseMonthlyDates } from '../../utils/frontendDateUtils';
/*
import { DateUtils } from 'react-day-picker';
import { toast } from 'react-toastify';
*/

const Subscription = ({ details, handleEdit, handleDelete }) => {
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

  return (
    <div className="subscription-details card d-flex flex-column align-items-start p-3">
      <p><strong>Name:</strong> {nickname || name}</p>
      <p><strong>Due Date:</strong> {repeatString}</p>
      <p><strong>Reminder Days:</strong> {reminderDays}</p>
      <p><strong>Amount:</strong> ${amount/100}</p>
      <div className="d-flex justify-content-between w-100">
        <button onClick={handleEdit} className="btn btn-link p-0" type="button">Edit</button>
        <button onClick={handleDelete} className="btn btn-link p-0 text-danger" type="button">Delete</button>
      </div>
    </div>
  );
};

export default Subscription;