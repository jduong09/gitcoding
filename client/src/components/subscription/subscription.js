import React from 'react';

const Subscription = ({ details, handleEdit, handleDelete }) => {
  const { name, nickname, dueDate, reminderDays, amount } = details;

  return (
    <ul className="subscription-details card d-flex flex-column align-items-start p-3">
      <li><strong>Name:</strong> {name}</li>
      <li><strong>Nickname:</strong> {nickname}</li>
      <li><strong>Frequency:</strong> {dueDate.frequency}</li>
      <li><strong>Occurence:</strong> {dueDate.occurence}</li>
      <li><strong>Reminder Days:</strong> {reminderDays}</li>
      <li><strong>Amount:</strong> ${amount/100}</li>
      <div className="d-flex justify-content-between w-100">
        <button onClick={handleEdit} className="btn btn-link p-0" type="button">Edit</button>
        <button onClick={handleDelete} className="btn btn-link p-0 text-danger" type="button">Delete</button>
      </div>
    </ul>
  );
};

export default Subscription;