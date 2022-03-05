import React from 'react';
import DayPicker from 'react-day-picker';

const DashboardCalendar = ({ subscriptions }) => {
  const dueDates = [];
  subscriptions.map((subscription) => {
    const { dueDate } = subscription;
    dueDates.push(new Date(dueDate.nextDueDate));
    return 'hi';
  });

  return (
    <DayPicker selectedDays={dueDates} />
  );
};

export default DashboardCalendar;