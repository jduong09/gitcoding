import React from 'react';

const Subscription = ({ details }) => {
  const { name, nickname, dueDate, reminderDays, amount } = details;

  return (
    <ul className="subscription-details">
      <li>Name: {name}</li>
      <li>Nickname: {nickname}</li>
      <li>Due Date: {dueDate}</li>
      <li>Reminder Days: {reminderDays}</li>
      <li>Amount: ${amount}</li>
    </ul>
  );
};

export default Subscription;