import { DateUtils } from 'react-day-picker';

const displayDueDate = ({ frequency, occurence, dates }) => {
  const todaysDate = new Date();
  const firstDate = new Date(dates[0]);
  let nearestDueDate = firstDate < todaysDate ?  DateUtils.addMonths(firstDate, 12) : firstDate;
  let dueDateString = '';

  // Yearly: If date is before current date, then we set due date to following year.
  // If date is after current date, then we set due date to given date.
  if (frequency === 'yearly') {
    // if date is after current date, then we set dueDate to given date.
    dates.map((date) => {
      const dateObject = new Date(date);
      if (dateObject > todaysDate) {
        if (dateObject < nearestDueDate) {
          nearestDueDate = new Date(date);
        } 
      };
      return nearestDueDate;
    });

    dueDateString = (nearestDueDate > todaysDate) 
      ? `${nearestDueDate.toLocaleDateString()}, Yearly` 
      : `${DateUtils.addMonths(nearestDueDate, 12).toLocaleDateString()}, Yearly`;
  } else if (frequency === 'monthly') {
    dates.map((date) => {
      const dateObject = new Date(date);

      
      if (dateObject > todaysDate) {
        if (dateObject < nearestDueDate) {
          nearestDueDate = new Date(date);
        }
      };
      return nearestDueDate;
    });

    // if occurence is greater than 1, we need to set reminder for the current month as well.
    dueDateString = (occurence > 1) 
      ? `${DateUtils.addMonths(nearestDueDate, parseInt(occurence, 10)).toLocaleDateString()}, Monthly`
      : `${nearestDueDate.toLocaleDateString()}, Monthly`;
  }
  return dueDateString;

  // Monthly: If there is only one date, such as every 15th of the month.
  // We want to look at occurence, and then determine which month, and then set date.
  // If there is more than one date, we need to find the nearest date and set that as the dueDate.

  // Weekly: Find nearest date. Similar to Monthly 

  // Daily: Add how many days to current date. Set dueDate.
};

export default displayDueDate;