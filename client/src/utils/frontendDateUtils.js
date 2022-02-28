import { addDays } from './sharedDateUtils';

const daysOfTheWeek = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

const parseDayOfTheMonth = (day) => {
  let result;
  if (day === 1 || day === 21 || day === 31) {
    result = `${day}st`;
  } else if (day === 2 || day === 22) {
    result = `${day}nd`;
  } else if (day === 3) {
    result = `${day}rd`;
  } else {
    result = `${day}th`;
  }
  return result;
};

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

export const parseWeeklyDates = (days) => {
  const string = days.reduce((previousValue, currentValue) => {
    const dateObject = new Date(currentValue);
    const dayOfTheWeek = daysOfTheWeek[dateObject.getUTCDay()];

    if (previousValue === '') {
      return `${dayOfTheWeek}`;
    }
    return `${previousValue}, ${dayOfTheWeek}`;
  }, '');
  return string;
};

export const parseMonthlyDates = (days) => {
  const string = days.reduce((previousValue, currentValue) => {
    const dateObject = new Date(currentValue);
    const dayOfTheMonth = dateObject.getUTCDate();

    const value = parseDayOfTheMonth(dayOfTheMonth);

    if (previousValue === '') {
      return `the ${value}`;
    }
    return `${previousValue}, ${value}`;
  }, '');
  return string;
};