const { DateUtils } = require('react-day-picker');
const { updateDatesBySubscriptionId } = require('../api/actions/subscriptions');

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

// due_date (jsonb) = { frequency: 'yearly', occurence: 1, dates: ['2022-2-3'], nextDueDate: ? };
// viewed (boolean) = if user has not viewed it, due date would be the due date that was previously calculated.
// if user has viewed it, due date would be the next upcoming due date. Viewed boolean would then be true.
const updateNextDueDate = async (dueDate, subscriptionUuid) => {
  const { frequency, occurence, dates } = dueDate;
  // todaysDate format: 'yyyy-mm-dd'
  const todaysDate = new Date(new Date().setHours(0, 0, 0, 0)).toISOString().substring(0, 10);
  let lateDueDate;
  if (frequency === 'yearly') {
    const newDatesObject = await dates.map((day) => {
      const date = new Date(day);
      if (date < new Date(todaysDate)) {
        // we want to alert them that the due date is passed.
        // we will switch our viewed boolean to true. This is because this function is called when user views their subscriptions.
        // we want to set the nextDueDate or maybe even dates array value, to next years date.
        // create a new date object, where the date that has passed is set to be a year from itself.
        lateDueDate = date.toISOString().substring(0, 10);

        return DateUtils.addMonths(date, 12).toISOString().substring(0, 10);
      }
      return day;
    });

    const body = {
      dueDate: {
        frequency,
        occurence,
        dates: newDatesObject
      },
      subscriptionUuid,
    };

    if (lateDueDate) {
      body.dueDate.lateDueDate = lateDueDate;
    }

    // set dates array to have our now updated due date.
    try {
      lateDueDate = await updateDatesBySubscriptionId(body);
    } catch(error) {
      console.log('Error: ', error);
    }

    return lateDueDate;
  } else if (frequency === 'monthly') {
    const nextDueDate = await dates.map((day) => {
      const date = new Date(day);
      if (date < new Date(todaysDate)) {
        lateDueDate = date.toISOString().substring(0, 10);
        return addMonths(date, parseInt(occurence, 10));
      }
      return day;
    });

    const body = {
      dueDate: {
        frequency,
        occurence,
        dates: nextDueDate,
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
  } else if (frequency === 'weekly') {
    const newDatesObject = dates.map((date) => {
      const dateObject = new Date(date);
      if (dateObject < new Date(todaysDate)) {
        lateDueDate = dateObject.toISOString().substring(0, 10);
        console.log(addDays(dateObject, occurence * 7).toISOString().substring(0, 10));
        return addDays(dateObject, occurence * 7).toISOString().substring(0, 10);
      }
      return date;
    });

    const body = {
      dueDate: {
        frequency, 
        occurence,
        dates: newDatesObject
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
  } else if (frequency === 'daily') {
    let newDueDate = new Date(dates[0]);
    if (newDueDate < new Date(todaysDate)) {
      lateDueDate = newDueDate;

      while (newDueDate < new Date(todaysDate)) {
        newDueDate = new Date(addDays(newDueDate, parseInt(occurence, 10)));
      }
    }

    const body = {
      dueDate: {
        frequency,
        occurence,
        dates: [newDueDate.toISOString().substring(0, 10)],
      },
      subscriptionUuid
    };

    if (lateDueDate) {
      body.dueDate.lateDueDate = lateDueDate.toUTCString();
    }

    try {
      lateDueDate = await updateDatesBySubscriptionId(body);
    } catch(error) {
      console.log('Error: ', error);
    }

    return lateDueDate;
  }
};

module.exports = {
  updateNextDueDate
};