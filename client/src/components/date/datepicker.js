import React, { useState, useEffect } from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import '../../customDayPicker.scss';
import { toast } from 'react-toastify';

const ReactDayPicker = ({ handleUpdate, updating, nextDueDate, frequency }) => {
  const [days, setDate] = useState([]);
  const [disabledDay, setDisabledDay] = useState('');
  const [canChangeMonth, setCanChangeMonth] = useState(true);

  useEffect(() => {
    if (updating) {   
      const newArray = updating.map((day) => new Date(day));
      setDate(newArray);

    
      if (frequency === 'yearly' || frequency === 'daily') {
        setDisabledDay({ before: updating[0], after: updating[0] });
      }

      if (frequency === 'monthly' && updating.length) {
        setCanChangeMonth(false);
      }
    }
  }, [updating, nextDueDate, frequency]);
  
  const handleDayClick = (day, { selected }) => {
    if (frequency === 'weekly') {
      return;
    }

    const selectedDays = days.concat();
    if (selected) {
      const selectedIndex = selectedDays.findIndex(selectedDay => DateUtils.isSameDay(selectedDay, day));
      selectedDays.splice(selectedIndex, 1);
      setDisabledDay(false);
    } else if ((frequency === 'yearly' || frequency === 'daily') && days.length) {
      toast.error(`Invalid Choice: Can't select multiple days for ${frequency} subscription.`);
    } else {
      selectedDays.push(day);

      if (frequency === 'yearly' || frequency === 'daily') {
        setDisabledDay({ before: day, after: day });
      }
    }
    
    setDate(selectedDays);
    setCanChangeMonth(true);
    handleUpdate(selectedDays);
  };

  const daysList = days.map((day) => day.toLocaleDateString());
  
  return (
    <section className="day-picker">
      <DayPicker 
        onDayClick={handleDayClick}
        selectedDays={days}
        disabledDays={disabledDay}
        month={nextDueDate ? new Date(nextDueDate) : new Date()}
        todayButton="Jump To Today"
        canChangeMonth={canChangeMonth}
      />
      <div>Days Selected: {daysList.join(', ')}</div>
    </section>
  );
};

export default ReactDayPicker;