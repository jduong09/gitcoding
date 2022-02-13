const { updateDatesBySubscriptionId } = require('../api/actions/subscriptions');
const { addDays, addMonths } = require('../../client/src/utils/sharedDateUtils');

const updateNextDueDate = async (dueDate, subscriptionUuid) => {
  const { frequency, occurrence, dates } = dueDate;
  const todaysDate = new Date(new Date().setHours(0, 0, 0, 0)).toISOString().substring(0, 10);
  let lateDueDate;
  let newDueDate;
  if (frequency === 'daily') {
    newDueDate = new Date(dates[0]);
    if (newDueDate < new Date(todaysDate)) {
      lateDueDate = newDueDate;

      while (newDueDate < new Date(todaysDate)) {
        newDueDate = new Date(addDays(newDueDate, parseInt(occurrence, 10)));
      }
    }
  }

  const newDatesObject = await dates.map((day) => {
    const date = new Date(day);
    if (date < new Date(todaysDate)) {
      lateDueDate = date.toISOString().substring(0, 10);

      if (frequency === 'yearly') {
        return addMonths(date, 12);
      } else if (frequency === 'monthly') {
        return addMonths(date, parseInt(occurrence, 10));
      } else if (frequency === 'weekly') {
        return new Date(addDays(date, occurrence * 7)).toISOString().substring(0, 10);
      }
    }
    return day;
  });

  const body = {
    dueDate: {
      frequency, 
      occurrence,
      dates: (frequency === 'daily') ? [newDueDate.toISOString().substring(0, 10)] : newDatesObject
    },
    subscriptionUuid
  };

  if (lateDueDate) {
    body.dueDate.lateDueDate = lateDueDate;
  }

  try {
    lateDueDate = await updateDatesBySubscriptionId(body);
  } catch(error) {
    console.log('Error: ', error);
  }

  return lateDueDate;
};

module.exports = {
  updateNextDueDate,
  addDays,
  addMonths
};