const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().substring(0, 10);
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