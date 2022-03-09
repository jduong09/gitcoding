import React from 'react';

const SubscriptionDetail = ({ details }) => {
  const { name, nickname, dueDate, reminderDays, amount } = details;

  return (
    <div>
      <h2>{nickname || name}</h2>
      <ul>
        <li><strong>Amount: </strong>{amount}</li>
        <li><strong>Next Due Date: </strong>{dueDate.nextDueDate}</li>
        <li><strong>Reminder Days: </strong>{reminderDays}</li>
      </ul>
    </div>
  );
};

export default SubscriptionDetail;