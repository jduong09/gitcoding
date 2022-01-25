import React from 'react';

const Subscription = ({ details }) => {
  const { name, nickname, dueDate, reminderDays, amount } = details;

  // const datesList = dueDate.dates.map((day) => )
  return (
    <ul className="subscription-details">
      <li>Name: {name}</li>
      <li>Nickname: {nickname}</li>
      <li>Frequency: {dueDate.frequency}</li>
      <li>Occurence: {dueDate.occurence}</li>
      <li>Reminder Days: {reminderDays}</li>
      <li>Amount: ${amount/100}</li>
    </ul>
  );
};

export default Subscription;