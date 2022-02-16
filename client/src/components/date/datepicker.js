import React, { useState, useEffect } from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

const ReactDayPicker = ({ handleUpdate, disabledDays, canChangeMonth, updating, nextDueDate }) => {
  const [days, setDate] = useState([]);

  useEffect(() => {
    if (updating) {     
      const newArray = updating.map((day) => new Date(day));
      setDate(newArray);
    }
  }, [updating, nextDueDate]);
  
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

  const daysList = days.map((day) => day.toLocaleDateString());
  
  return (
    <section className="day-picker">
      <DayPicker 
        onDayClick={handleDayClick}
        selectedDays={days}
        hideOnDayClick={false}
        disabledDays={disabledDays}
        canChangeMonth={canChangeMonth}
        month={nextDueDate ? new Date(nextDueDate) : new Date()}
      />
      <div>Days Selected: {daysList.join(', ')}</div>
    </section>
  );
};

export default ReactDayPicker;