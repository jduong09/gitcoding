import React, { useState, useEffect } from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { toast } from 'react-toastify';

const ReactDayPicker = ({ handleUpdate, canChangeMonth, updating, nextDueDate, frequency }) => {
  const [days, setDate] = useState([]);
  const [disabledDay, setDisabledDay] = useState('');

  useEffect(() => {
    if (updating) {     
      const newArray = updating.map((day) => new Date(day));
      setDate(newArray);

      if (frequency !== 'monthly') {
        const dateObject = new Date(updating[0]);
        setDisabledDay({ before: dateObject, after: dateObject });
      }
    }
  }, [updating, nextDueDate, frequency]);
  
  const handleDayClick = (day, { selected }) => {
    const selectedDays = days.concat();
    if (selected) {
      const selectedIndex = selectedDays.findIndex(selectedDay => DateUtils.isSameDay(selectedDay, day));
      selectedDays.splice(selectedIndex, 1);
      setDisabledDay(false);
    } else  if ((frequency === 'yearly' || frequency === 'daily') && (days.length !== 0)) {
      toast.error(`Invalid Choice: Can't select multiple days for ${frequency} subscription.`);
    } else {
      selectedDays.push(day);

      if (frequency !== 'monthly') {
        setDisabledDay({ before: day, after: day });
      }
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
        disabledDays={disabledDay}
        canChangeMonth={canChangeMonth}
        month={nextDueDate ? new Date(nextDueDate) : new Date()}
      />
      <div>Days Selected: {daysList.join(', ')}</div>
    </section>
  );
};

export default ReactDayPicker;