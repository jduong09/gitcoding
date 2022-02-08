import { DateUtils } from 'react-day-picker';
import { toast } from 'react-toastify';

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().substring(0, 10);
};

const addMonths = (date, numberOfMonths) => {
  const dateObject = new Date(date.toISOString().substring(0, 10));
  const newMonth = dateObject.getUTCMonth() + numberOfMonths;
  const dateValue = date.setUTCMonth(newMonth);
  return new Date(dateValue).toISOString().substring(0, 10);
};

export const convertWeekdaysToDates = (occurence, days) => {
  const todaysDate = new Date(new Date().setHours(0, 0, 0, 0)).toISOString().substring(0, 10);
  const todaysWeekDay = new Date(todaysDate).getUTCDay();
  const dates = days.map((weekday) => {
    const differenceBetweenDays = occurence * (weekday - todaysWeekDay);
    const date = addDays(todaysDate, differenceBetweenDays);
    return date;
  });
  return dates;
};

// To-Do: Refactor function.
export const displayDueDate = (dueDate, name) => {
  const { frequency, occurence, dates } = dueDate;
  const todaysDate = new Date(new Date().setHours(0, 0, 0, 0)).toISOString().substring(0, 10);
  const firstDate = new Date(dates[0]);
  const firstDateString = firstDate.toISOString().substring(0, 10);
  let nearestDueDate;
  let dueDateString;

  if (frequency === 'yearly') {
    nearestDueDate = new Date(firstDateString) < new Date(todaysDate) ? new Date(addMonths(firstDate, 12)) : new Date(firstDateString);
    for (let i = 0; i < dates.length; i += 1) {
      const dateObject = new Date(dates[i]);
      if (DateUtils.isSameDay(dateObject, new Date(todaysDate))) {
        nearestDueDate = dateObject;
        toast(`Your subscription ${name} is due!`);
        break;
      }

      if (dateObject < new Date(todaysDate)) {
        const adjustedDate = addMonths(dateObject, 12);
        if (adjustedDate < nearestDueDate) {
          nearestDueDate = adjustedDate;
        }
      }

      if (dateObject > new Date(todaysDate)) {
        if (dateObject < nearestDueDate) {
          nearestDueDate = dateObject;
        }
      }
    }

    dueDateString = (nearestDueDate < new Date(todaysDate)) 
    ? `${DateUtils.addMonths(nearestDueDate, 12).toISOString().substring(0, 10)}, Yearly`
    : `${nearestDueDate.toISOString().substring(0, 10)}, Yearly`;
  } else if (frequency === 'monthly') {
    nearestDueDate = (new Date(firstDateString) < new Date(todaysDate)) ? new Date(addMonths(firstDate, occurence)) : new Date(firstDateString);
    for (let i = 0; i < dates.length; i += 1) {
      const dateObject = new Date(dates[i]);
      if (DateUtils.isSameDay(dateObject, new Date(todaysDate))) {
        nearestDueDate = todaysDate;
        toast(`Your subcription ${name} is due!`);
        break;
      }

      if (dateObject < new Date(todaysDate)) {
        const adjustedDate = addMonths(dateObject, occurence);
        if (adjustedDate < nearestDueDate) {
          nearestDueDate = adjustedDate;
        }
      }

      if (dateObject > new Date(todaysDate)) {
        if (dateObject < nearestDueDate) {
          nearestDueDate = dateObject;
        }
      }
    }

    // if occurence is greater than 1, we need to set reminder for the current month as well.
    dueDateString = (nearestDueDate < new Date(todaysDate)) 
      ? `${addMonths(nearestDueDate, occurence)}, Monthly`
      : `${new Date(nearestDueDate).toISOString().substring(0, 10)}, Monthly`;
  } else if (frequency === 'weekly') {
    nearestDueDate = (new Date(firstDateString) < new Date(todaysDate)) ? new Date(addDays(firstDate, 7)) : new Date(firstDateString);
    for (let i = 0; i < dates.length; i += 1) {
      const dateObject = new Date(dates[i]);
      if (DateUtils.isSameDay(dateObject, new Date(todaysDate))) {
        nearestDueDate = todaysDate;
        toast(`Your subcription ${name} is due!`);
        break;
      }

      if (dateObject > new Date(todaysDate)) {
        if (dateObject < nearestDueDate) {
          nearestDueDate = dateObject;
        }
      }
    }

    dueDateString = `${new Date(nearestDueDate).toISOString().substring(0, 10)}, Weekly`;
  } else if (frequency === 'daily') {
    if (firstDate > new Date(todaysDate)) {
      nearestDueDate = firstDate;
    } else {
      nearestDueDate = firstDate;
      while (nearestDueDate < new Date(todaysDate)) {
        nearestDueDate = new Date(addDays(nearestDueDate, parseInt(occurence, 10)));
      }
    }

    if (DateUtils.isSameDay(nearestDueDate, new Date(todaysDate))) {
      nearestDueDate = new Date(todaysDate);
      toast(`Your subcription ${name} is due!`);
    }

    dueDateString = `${nearestDueDate.toISOString().substring(0, 10)}, Daily`;
  }
  return dueDateString;
};