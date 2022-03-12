import React, { useEffect, useState } from 'react';
import DayPicker from 'react-day-picker';

const DashboardCalendar = ({ subscriptions }) => {
  const [dueDates, setDueDates] = useState([]);

  useEffect(() => {
    const dates = subscriptions.map((subscription) => new Date(subscription.dueDate.nextDueDate));
    setDueDates(dates);
  }, [dueDates, subscriptions]);

  return (
    <DayPicker selectedDays={dueDates} />
  );
};

export default DashboardCalendar;