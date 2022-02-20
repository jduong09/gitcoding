import { addDays } from './sharedDateUtils';

export const convertWeekdaysToDates = (days) => {
  const todaysDate = new Date();
  const todaysWeekDay = new Date(todaysDate).getUTCDay();
  const dates = days.map((weekday) => {
    const differenceBetweenDays = weekday - todaysWeekDay;
    const date = addDays(todaysDate, differenceBetweenDays);
    return new Date(date);
  });
  return dates;
};

export const convertStringToDate = (datesArray) => datesArray.map((date) => new Date(date));

export const convertDatesToWeekdays = (days) => days.map((date) => date.getUTCDay());
