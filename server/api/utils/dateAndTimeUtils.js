/**
 * @description Convert date string to string compatible with insertion into postgres's make_timestampz function.
 * @params date (string) formated 'yyyy-mm-dd'
 * @returns object containing year month day.
 */

const convertDateToTimestampz = (date) => {
  const dateObject = {}
  const str = date.split('-');
  ['year', 'month', 'day'].map((key, idx) => dateObject[key] = str[idx]);
  return dateObject;
};

module.exports = { convertDateToTimestampz };