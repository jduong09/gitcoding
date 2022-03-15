import React from 'react';
import DetailCalendar from '../date/detailCalendar';

const SubscriptionDetail = ({ setActiveSubscription, details }) => {
  const { name, nickname, dueDate, reminderDays, amount } = details;
  return (
    <div className="col-11 p-1 d-flex flex-column borderSubscriptionForm">
      <h2 className="col-12 text-center">{nickname || name}</h2>
      <div className="col-12 d-flex">
        <ul className="col-6">
          <li><strong>Amount: </strong>${amount/100}</li>
          <li><strong>Next Due Date: </strong>{new Date(dueDate.nextDueDate).toLocaleDateString()}</li>
          <li><strong>Reminder Days: </strong>{reminderDays}</li>
        </ul>
        <div className="col-6" id="dayPickerForm">
          <DetailCalendar dueDate={dueDate}/>
        </div>
      </div>
      <button className="col-8 btn btn-primary mx-auto" type="button" onClick={() => setActiveSubscription(false)}>Home</button>
    </div>
  );
};

export default SubscriptionDetail;