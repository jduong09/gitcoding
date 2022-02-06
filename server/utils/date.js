const { DateUtils } = require('react-day-picker');
const { updateDatesBySubscriptionId } = require('../api/actions/subscriptions');

// due_date (jsonb) = { frequency: 'yearly', occurence: 1, dates: ['2022-2-3'], nextDueDate: ? };
// viewed (boolean) = if user has not viewed it, due date would be the due date that was previously calculated.
// if user has viewed it, due date would be the next upcoming due date. Viewed boolean would then be true.
const updateNextDueDate = async (dueDate, subscriptionUuid) => {
  const { frequency, occurence, dates } = dueDate;
  const todaysDate = new Date();
  let lateDueDate;
  if (frequency === 'yearly') {
    const newDatesObject = await dates.map((day) => {
      const date = new Date(day);
      if (date < todaysDate) {
        // we want to alert them that the due date is passed.
        // we will switch our viewed boolean to true. This is because this function is called when user views their subscriptions.
        // we want to set the nextDueDate or maybe even dates array value, to next years date.
        // create a new date object, where the date that has passed is set to be a year from itself.
        lateDueDate = date;

        return DateUtils.addMonths(date, 12).toISOString();
        // both of these last comments require a patch request to subscriptions, and changing the due_date column.
      }
      return day;
      // ELSE: 
      // todays date has not passed the due date.
      // we want to display that their due date is coming up.
      // we want to make sure next due date is set to this date.
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
      console.log(lateDueDate);
    } catch(error) {
      console.log('Error: ', error);
    }

    return lateDueDate;
  } else if (frequency === 'monthly') {
    const nextDueDate = await dates.map((day) => {
      const date = new Date(day);
      if (date < todaysDate) {
        lateDueDate = day;
        return DateUtils.addMonths(date, parseInt(occurence, 10)).toISOString();

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
  } else if (frequency === 'weekly'){
    console.log('hey');
  } else if (frequency === 'daily') {
    // dates will be a one item array.
    let newDueDate = dates[0];
    if (newDueDate < todaysDate) {
      // alert them that their subscription has passed.
      /*
      if (!viewed) {
        toast.alert('Your due date for your subscription has passed!)
      }
      * Set the viewed to true.
      */
      // set next due date.
      lateDueDate = newDueDate;
      newDueDate = addDays(newDueDate, occurence);
      const body = {
        dueDate: {
          frequency,
          occurence,
          dates: [newDueDate],
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
    }

    return lateDueDate;
  }
};

module.exports = {
  updateNextDueDate
};