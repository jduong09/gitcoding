import { DateUtils } from 'react-day-picker';

const displayDueDate = ({ frequency, occurence, dates }) => {
  const todaysDate = new Date();
  const firstDate = new Date(dates[0]);
  let nearestDueDate = firstDate;
  let dueDateString = '';
  // Yearly: If date is before current date, then we set due date to following year.
  // If date is after current date, then we set due date to given date.
  if (frequency === 'yearly') {
    nearestDueDate = firstDate < todaysDate ?  DateUtils.addMonths(firstDate, 12) : firstDate;
    for (let i = 0; i < dates.length; i += 1) {
      const dateObject = new Date(dates[i]);
      // if dates contains today, dueDate is today.
      if (DateUtils.isSameDay(todaysDate, dateObject)) {
        nearestDueDate = todaysDate;
        break;
      }

      if (dateObject > todaysDate) {
        if (dateObject < nearestDueDate) {
          nearestDueDate = new Date(dates[i]);
        } 
      }
    }

    dueDateString = (nearestDueDate > todaysDate) 
      ? `${nearestDueDate.toLocaleDateString()}, Yearly` 
      : `${DateUtils.addMonths(nearestDueDate, 12).toLocaleDateString()}, Yearly`;
  } else if (frequency === 'monthly') {
    for (let i = 0; i < dates.length; i += 1) {
      const dateObject = new Date(dates[i]);

      if (DateUtils.isSameDay(todaysDate, dateObject)) {
        nearestDueDate = todaysDate;
        break;
      }

      if (dateObject > todaysDate) {
        if (dateObject < nearestDueDate) {
          nearestDueDate = new Date(dates[i]);
        }
      }
    }
    // if occurence is greater than 1, we need to set reminder for the current month as well.
    dueDateString = (occurence > 1 && nearestDueDate < todaysDate) 
      ? `${DateUtils.addMonths(nearestDueDate, parseInt(occurence, 10)).toLocaleDateString()}, Monthly`
      : `${nearestDueDate.toLocaleDateString()}, Monthly`;
  } else if (frequency === 'weekly') {
    console.log(todaysDate.getDay());
  }
  return dueDateString;

  // Monthly: If there is only one date, such as every 15th of the month.
  // We want to look at occurence, and then determine which month, and then set date.
  // If there is more than one date, we need to find the nearest date and set that as the dueDate.

  // Weekly: Find nearest date. Similar to Monthly 

  // Daily: Add how many days to current date. Set dueDate.
};

export default displayDueDate;