const addDays = (date, days) => {
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

module.exports = {
  addDays,
  addMonths
};