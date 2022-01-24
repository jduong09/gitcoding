import React, { useState } from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import "react-day-picker/lib/style.css";

const ReactDayPicker = ({ handleUpdate, disabledDays }) => {
  const [days, setDate] = useState([]);
  
  const handleDayClick = (day, { selected }) => {
    const selectedDays = days.concat();
    if (selected) {
      const selectedIndex = selectedDays.findIndex(selectedDay => DateUtils.isSameDay(selectedDay, day));
      selectedDays.splice(selectedIndex, 1);
    } else {
      selectedDays.push(day);
    }
    setDate(selectedDays);
    handleUpdate(selectedDays);
  };

  return (
      <DayPicker onDayClick={handleDayClick} selectedDays={days} hideOnDayClick={false} disabledDays={disabledDays} />
  );
};

export default ReactDayPicker;