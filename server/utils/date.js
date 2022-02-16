const { updateDatesBySubscriptionId } = require('../api/actions/subscriptions');
const { addDays, addMonths } = require('../../client/src/utils/sharedDateUtils');

const displayDueDate = (dueDate) => {
  const { frequency, occurrence, dates } = dueDate;
  const todaysDate = new Date(new Date().setHours(0, 0, 0, 0)).toISOString().substring(0, 10);
  const firstDate = new Date(dates[0]);
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

    /*
    if (DateUtils.isSameDay(nearestDueDate, new Date(todaysDate))) {
      nearestDueDate = new Date(todaysDate);
      toast(`Your subcription ${name} is due!`);
    }
    */
  }

  if (frequency === 'yearly') {
    nearestDueDate = firstDate < new Date(todaysDate) ? new Date(addMonths(firstDate, 12)) : firstDate;
  } else if (frequency === 'monthly') {
    nearestDueDate = (firstDate < new Date(todaysDate)) ? new Date(addMonths(firstDate, occurrence)) : firstDate;
  } else if (frequency === 'weekly') {
    nearestDueDate = (firstDate < new Date(todaysDate)) ? new Date(addDays(firstDate, 7)) : firstDate;
  }

  for (let i = 0; i < dates.length; i += 1) {
    const dateObject = new Date(dates[i]);
    /*
    const utcDateObject = new Date(dateObject.toISOString().substring(0, 10));
    if (DateUtils.isSameDay(utcDateObject, new Date(todaysDate))) {
      nearestDueDate = dateObject;
      toast(`Your subscription ${name} is due!`);
      break;
    }
    */

    if (dateObject < new Date(todaysDate)) {
      let adjustedDate;
      if (frequency === 'yearly') {
        adjustedDate = addMonths(dateObject, 12);
      } else if (frequency === 'monthly') {
        adjustedDate = addMonths(dateObject, parseInt(occurrence, 10));
      } else if (frequency === 'weekly') {
        adjustedDate = new Date(addDays(dateObject, 7));
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

  const dueDateString = `${nearestDueDate.toISOString()}`;
  console.log(dueDateString);

  return nearestDueDate.toISOString();
};

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
        return addDays(date, parseInt(occurrence, 10) * 7);
      }
    }
    return day;
  });

  const nextDueDate = displayDueDate({ frequency, occurrence, dates: newDatesObject });
  
  const body = {
    dueDate: {
      frequency, 
      occurrence,
      dates: (frequency === 'daily') ? [newDueDate.toISOString().substring(0, 10)] : newDatesObject,
      nextDueDate
    },
    subscriptionUuid
  };

  if (lateDueDate) {
    body.dueDate.lateDueDate = lateDueDate;
  }

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