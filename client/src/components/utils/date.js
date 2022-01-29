const concatenateDates = (dates) => {
  const string = dates.reduce((previousValue, currentValue, currentIndex) => {
    if (currentIndex === 0) {
      return `${previousValue} ${currentValue.substring(0, 10)}`;
    }
    if (currentIndex === (dates.length - 1)) {
      return `${previousValue}, and ${currentValue.substring(0, 10)}`;
    }
    return `${previousValue}, ${currentValue.substring(0, 10)}`;
  }, '');

  return string;
};

const concatenateWeekDays = (dates) => {
  const weekdays = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday', 
    6: 'Saturday', 
  };

  const string = dates.reduce((previousValue, currentValue, currentIndex) => {
    if (currentIndex === (dates.length - 1)) {
      return `${weekdays[previousValue]}, and ${weekdays[currentValue]}`;
    }
    return `${weekdays[previousValue]}, ${weekdays[currentValue]}`;
  });
  return string;
};

const parseDueDate = ({ frequency, occurence, dates }) => {
  let dueDateString;
  switch (frequency) {
    case 'yearly':
      dueDateString = `Every year on ${concatenateDates(dates)}.`;
      break;
    case 'monthly':
      dueDateString = `Every ${occurence} months on ${concatenateDates(dates)}.`;
      break;
    case 'weekly':
      dueDateString = `Every ${occurence} weeks on ${concatenateWeekDays(dates)}.`;
      break;
    case 'daily':
      dueDateString = `Every ${occurence} days.`;
      break;
    default:
      break;
  }
  return dueDateString;
};

export default parseDueDate;