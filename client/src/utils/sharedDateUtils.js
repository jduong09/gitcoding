const addDays = (date, days) => {
  const result = new Date(date);
  const newDate = result.setDate(result.getDate() + days);
  return new Date(newDate).toISOString();
};

const addMonths = (date, numberOfMonths) => {
  const dateObject = new Date(date.toISOString());
  const newMonth = dateObject.getUTCMonth() + numberOfMonths;
  const dateValue = dateObject.setUTCMonth(newMonth);
  return new Date(dateValue).toISOString();
};

module.exports = {
  addDays,
  addMonths
};