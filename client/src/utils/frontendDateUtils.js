import { addDays } from './sharedDateUtils';

const convertWeekdaysToDates = (days) => {
  const todaysDate = new Date();
  const todaysWeekDay = new Date(todaysDate).getUTCDay();
  const dates = days.map((weekday) => {
    const differenceBetweenDays = weekday - todaysWeekDay;
    const date = addDays(todaysDate, differenceBetweenDays);
    return date;
  });
  return dates;
};

export default convertWeekdaysToDates;