import { DateUtils } from 'react-day-picker';
import { toast } from 'react-toastify';
import { addDays, addMonths } from './sharedDateUtils';

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

export const displayDueDate = (dueDate, name) => {
  const { frequency, occurrence, dates } = dueDate;
  const todaysDate = new Date(new Date().setHours(0, 0, 0, 0)).toISOString().substring(0, 10);
  const firstDate = new Date(dates[0]);
  let nearestDueDate;

  if (frequency === 'daily') {
    if (firstDate > new Date(todaysDate)) {
      nearestDueDate = firstDate;
    } else {
      nearestDueDate = firstDate;
      while (nearestDueDate < new Date(todaysDate)) {
        nearestDueDate = new Date(addDays(nearestDueDate, parseInt(occurrence, 10)));
      }
    }

    if (DateUtils.isSameDay(nearestDueDate, new Date(todaysDate))) {
      nearestDueDate = new Date(todaysDate);
      toast(`Your subcription ${name} is due!`);
    }
  }

  if (frequency === 'yearly') {
    nearestDueDate = firstDate < new Date(todaysDate) ? new Date(addMonths(firstDate, 12)) : firstDate;
  } else if (frequency === 'monthly') {
    nearestDueDate = (firstDate < new Date(todaysDate)) ? new Date(addMonths(firstDate, occurrence)) : firstDate;
  } else if (frequency === 'weekly') {
    nearestDueDate = (firstDate < new Date(todaysDate)) ? new Date(addDays(firstDate, 7)) : firstDate;
  }

  for (let i = 0; i < dates.length; i += 1) {
    const dateObject = new Date(dates[i]);
    const utcDateObject = new Date(dateObject.toISOString().substring(0, 10));
    if (DateUtils.isSameDay(utcDateObject, new Date(todaysDate))) {
      nearestDueDate = dateObject;
      toast(`Your subscription ${name} is due!`);
      break;
    }

    if (dateObject < new Date(todaysDate)) {
      let adjustedDate;
      if (frequency === 'yearly') {
        adjustedDate = addMonths(dateObject, 12);
      } else if (frequency === 'monthly') {
        adjustedDate = addMonths(dateObject, occurrence);
      } else if (frequency === 'weekly') {
        adjustedDate = new Date(addDays(dateObject, 7));
      }

      if (adjustedDate < nearestDueDate) {
        nearestDueDate = adjustedDate;
      }
    }

    if (dateObject > new Date(todaysDate)) {
      console.log(`Date Object is greater than todays date.`);
      if (dateObject < nearestDueDate) {
        nearestDueDate = dateObject;
      }
    }
  }

  const dueDateString = `${nearestDueDate.toISOString().substring(0, 10)}, ${frequency}`;

  return dueDateString;
};