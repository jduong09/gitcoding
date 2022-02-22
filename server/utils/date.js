const { updateDatesBySubscriptionId } = require('../api/actions/subscriptions');
const { addDays, addMonths } = require('../../client/src/utils/sharedDateUtils');

const displayDueDate = ({ frequency, occurrence, newDatesObject }) => {
  const todaysDate = new Date(new Date().setHours(0, 0, 0, 0)).toISOString().substring(0, 10);
  const firstDate = new Date(newDatesObject[0]);
  let nearestDueDate;

  if (frequency === 'daily') {
    if (firstDate > new Date(todaysDate)) {
      nearestDueDate = firstDate;
    } else {
      nearestDueDate = firstDate;
      while (nearestDueDate < new Date(todaysDate)) {
        nearestDueDate = new Date(addDays(nearestDueDate, parseInt(occurrence, 10)));
      }
    }
  }

  if (frequency === 'yearly') {
    nearestDueDate = firstDate < new Date(todaysDate) ? new Date(addMonths(firstDate, 12)) : firstDate;
  } else if (frequency === 'monthly') {
    nearestDueDate = (firstDate < new Date(todaysDate)) ? new Date(addMonths(firstDate, occurrence)) : firstDate;
  } else if (frequency === 'weekly') {
    nearestDueDate = (firstDate < new Date(todaysDate)) ? new Date(addDays(firstDate, 7)) : firstDate;
  }

  for (let i = 0; i < newDatesObject.length; i += 1) {
    const dateObject = new Date(newDatesObject[i]);

    if (dateObject < new Date(todaysDate)) {
      let adjustedDate;
      if (frequency === 'yearly') {
        adjustedDate = addMonths(dateObject, 12);
      } else if (frequency === 'monthly') {
        adjustedDate = addMonths(dateObject, parseInt(occurrence, 10));
      } else if (frequency === 'weekly') {
        adjustedDate = addDays(dateObject, 7);
      }

      if (adjustedDate < nearestDueDate) {
        nearestDueDate = adjustedDate;
      }
    }

    if (dateObject > new Date(todaysDate)) {
      if (dateObject < nearestDueDate) {
        nearestDueDate = dateObject;
      }
    }
  }

  return nearestDueDate.toISOString();
};

const updateNextDueDate = async (dueDate, subscriptionUuid) => {
  const { frequency, occurrence, dates } = dueDate;
  const todaysDate = new Date(new Date().setHours(0, 0, 0, 0)).toISOString().substring(0, 10);
  let lateDueDate;

  const formatDate = (frequency) => {
    let newDueDate;
    if (frequency === 'daily') {
      newDueDate = new Date(dates[0]);
      if (newDueDate < new Date(todaysDate)) {
        lateDueDate = newDueDate.toISOString();

        while (newDueDate < new Date(todaysDate)) {
          newDueDate = new Date(addDays(newDueDate, parseInt(occurrence, 10)));
        }
      }
      return [newDueDate.toISOString()];
    } else {
      const newDatesObject = dates.map((day) => {
        const date = new Date(day);
        if (date < new Date(todaysDate)) {
          lateDueDate = date.toISOString();

          if (frequency === 'yearly') {
            return addMonths(date, 12);
          } else if (frequency === 'monthly') {
            return addMonths(date, parseInt(occurrence, 10));
          } else if (frequency === 'weekly') {
            return addDays(date, parseInt(occurrence, 10) * 7);
          }
        }
        return day;
      });
      return newDatesObject;
    }
  }

  const newDatesObject = formatDate(frequency);
  const nextDueDate = displayDueDate({ frequency, occurrence, newDatesObject });

  const body = {
    dueDate: {
      frequency,
      occurrence,
      dates: newDatesObject,
      nextDueDate,
      lateDueDate
    },
    subscriptionUuid
  };

  let updatedSubscription;
  try {
    updatedSubscription = await updateDatesBySubscriptionId(body);
  } catch(error) {
    console.log('Error: ', error);
  }

  return updatedSubscription;
};

module.exports = {
  updateNextDueDate
};