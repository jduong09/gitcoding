import React from 'react';

// Display Subscription.
const Subscription = ({ details }) => {
  const { name, nickname, due_date, reminder_days, amount } = details;

  return (
    <ul className="subscription-details">
      <li>Name: {name}</li>
      <li>Nickname: {nickname}</li>
      <li>DueDate: {due_date}</li>
      <li>ReminderDays: {reminder_days}</li>
      <li>Amount: {amount}</li>
    </ul>
  )
};

export default Subscription;