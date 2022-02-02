import React from 'react';
import { displayDueDate } from '../utils/date';

const Subscription = ({ details, handleEdit, handleDelete }) => {
  const { name, nickname, dueDate, reminderDays, amount } = details;
  const repeatString = displayDueDate(dueDate);

  return (
    <div className="subscription-details card d-flex flex-column align-items-start p-3">
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Nickname:</strong> {nickname}</p>
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