import React, { useEffect, useState } from 'react';
import DayPicker from 'react-day-picker';

const DetailCalendar = ({ dueDate }) => {
  const [subscriptionDates, setDates] = useState([]);
  useEffect(() => {
    const { dates } = dueDate;

    const selectedDays = dates.map((date) => new Date(date));

    setDates(selectedDays);
  }, [dueDate]);

  return (
    <DayPicker selectedDays={subscriptionDates} />
  );
};

export default DetailCalendar;