import React, { useState } from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

const ReactDayPicker = ({ handleUpdate, disabledDays, canChangeMonth }) => {
  const [days, setDate] = useState([]);

  /*
  useEffect(() => {
    if (resetDays && !updating) {
      setDate([]);
    };

    resetDays, updating

    if (updating) {
      const newArray = updating.map((day) => new Date(day));
      setDate(newArray);
    }
    
  }, [resetDays, updating]);
  */
  
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
    <DayPicker onDayClick={handleDayClick} selectedDays={days} hideOnDayClick={false} disabledDays={disabledDays} canChangeMonth={canChangeMonth} />
  );
};

export default ReactDayPicker;