import { addDays } from './sharedDateUtils';

export const convertWeekdaysToDates = (days) => {
  const todaysDate = new Date();
  const todaysWeekDay = new Date(todaysDate).getUTCDay();
  const dates = days.map((weekday) => {
    const differenceBetweenDays = weekday - todaysWeekDay;
    const date = addDays(todaysDate, differenceBetweenDays);
    const adjustedDate = new Date(new Date(date).setUTCHours(17, 0, 0, 0));
    return adjustedDate;
  });
  return dates;
};

export const convertStringToDate = (datesArray) => datesArray.map((date) => new Date(date));

export const convertDatesToWeekdays = (days) => days.map((date) => date.getUTCDay());
