import { DateUtils } from 'react-day-picker';

// Need to scrap the previosu dates with the new dates! 
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const displayDueDate = ({ frequency, occurence, dates }) => {
  const todaysDate = new Date();
  const firstDate = new Date(dates[0]);
  let nearestDueDate;
  let dueDateString;
  // Yearly: If date is before current date, then we set due date to following year.
  // If date is after current date, then we set due date to given date.
  if (frequency === 'yearly') {
    nearestDueDate = firstDate < todaysDate ?  DateUtils.addMonths(firstDate, 12) : firstDate;
    for (let i = 0; i < dates.length; i += 1) {
      const dateObject = new Date(dates[i]);
      // if dates contains today, dueDate is today.
      if (DateUtils.isSameDay(todaysDate, dateObject)) {
        nearestDueDate = todaysDate;
        break;
      }

      if (dateObject > todaysDate) {
        if (dateObject < nearestDueDate) {
          nearestDueDate = new Date(dates[i]);
        } 
      }
    }

    dueDateString = (nearestDueDate > todaysDate) 
      ? `${nearestDueDate.toLocaleDateString()}, Yearly` 
      : `${DateUtils.addMonths(nearestDueDate, 12).toLocaleDateString()}, Yearly`;
  } else if (frequency === 'monthly') {
    nearestDueDate = firstDate;
    for (let i = 0; i < dates.length; i += 1) {
      const dateObject = new Date(dates[i]);
      if (DateUtils.isSameDay(todaysDate, dateObject)) {
        nearestDueDate = todaysDate;
        break;
      }

      if (dateObject > todaysDate) {
        if (dateObject < nearestDueDate) {
          nearestDueDate = new Date(dates[i]);
        }
      }
    }
    // if occurence is greater than 1, we need to set reminder for the current month as well.
    dueDateString = (occurence > 1 && nearestDueDate < todaysDate) 
      ? `${DateUtils.addMonths(nearestDueDate, parseInt(occurence, 10)).toLocaleDateString()}, Monthly`
      : `${nearestDueDate.toLocaleDateString()}, Monthly`;
  } else if (frequency === 'weekly') {
    nearestDueDate = addDays(todaysDate, 7);
    const todaysWeeklyDay = todaysDate.getDay();
    let differenceBetweenDays;
    for (let i = 0; i < dates.length; i += 1) {
      if (todaysWeeklyDay === parseInt(dates[i], 10)) {
        nearestDueDate = todaysDate;
        break;
      }

      if (todaysWeeklyDay > dates[i]) {
        differenceBetweenDays = (occurence * 7) - todaysWeeklyDay + parseInt(dates[i], 10);
        const calculateDay = addDays(todaysDate, differenceBetweenDays);
        if (calculateDay < nearestDueDate) {
          nearestDueDate = calculateDay;
        }
      } else if (todaysWeeklyDay < dates[i]) {
        differenceBetweenDays = dates[i] - todaysWeeklyDay;
        console.log(differenceBetweenDays);
        const calculateDay = addDays(todaysDate, differenceBetweenDays);
        if (calculateDay < nearestDueDate) {
          nearestDueDate = calculateDay;
        }
      }
    }
    dueDateString = `${nearestDueDate.toLocaleDateString()}, Weekly`;
  } else if (frequency === 'daily') {
    const currentDueDate = firstDate;
    if (DateUtils.isSameDay(todaysDate, currentDueDate)) {
      nearestDueDate = todaysDate;
    } else if (todaysDate < currentDueDate) {
      nearestDueDate = currentDueDate;
    } else {
      nearestDueDate = addDays(currentDueDate, parseInt(occurence, 10));
    }

    dueDateString = `${nearestDueDate.toLocaleDateString()}, Daily`;
  }
  return dueDateString;

  // Monthly: If there is only one date, such as every 15th of the month.
  // We want to look at occurence, and then determine which month, and then set date.
  // If there is more than one date, we need to find the nearest date and set that as the dueDate.

  // Weekly: Find nearest date. Similar to Monthly 

  // Daily: Add how many days to current date. Set dueDate.
};

// due_date (jsonb) = { frequency: 'yearly', occurence: 1, dates: ['2022-2-3'], nextDueDate: ? };
// viewed (boolean) = if user has not viewed it, due date would be the due date that was previously calculated.
// if user has viewed it, due date would be the next upcoming due date.
export const updateNextDueDate = async (dueDate, subscriptionUuid) => {
  const { frequency, occurence, dates } = dueDate;
  // initialize today's date.
  const todaysDate = new Date();
  /**
   * Updating yearly subscriptions
   */
  if (frequency === 'yearly') {
    // first date. Pretend we only allow one date.
    
    const newDatesObject = await dates.map((day) => {
      // if todays date is past the due date
      const date = new Date(day);
      if (date < todaysDate) {
        // we want to alert them that the due date is passed.
        // we will switch our viewed boolean to true. This is because this function is called when user views their subscriptions.
        // we want to set the nextDueDate or maybe even dates array value, to next years date.
        // create a new date object, where the date that has passed is set to be a year from itself.
        return DateUtils.addMonths(date, 12).toISOString();
        // both of these last comments require a patch request to subscriptions, and changing the due_date column.
      }
      return day;
      // ELSE: 
      // todays date has not passed the due date.
      // we want to display that their due date is coming up.
      // we want to make sure next due date is set to this date.
    });

    const newDueDateObject = {
      frequency,
      occurence,
      dates: newDatesObject
    };
    // set dates array to have our now updated due date.
    try {
      await fetch(`${window.location.pathname}/subscriptions/${subscriptionUuid}`, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          dueDate: newDueDateObject
        })
      });
    } catch(error) {
      console.log('Error: ', error);
    }
  } else if (frequency === 'monthly') {
    const nextDueDate = await dates.map((day) => {
      const date = new Date(day);
      if (date < todaysDate) {
        return DateUtils.addMonths(date, parseInt(occurence, 10)).toISOString();
      }
      return day;
    });

    const newDueDateObject = {
      frequency,
      occurence,
      dates: nextDueDate
    };

    try {
      await fetch(`${window.location.pathname}/subscriptions/${subscriptionUuid}`, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          dueDate: newDueDateObject
        })
      });
    } catch(error) {
      console.log('Error: ', error);
    }
  } else if (frequency === 'daily') {
    // dates will be a one item array.
    let newDueDate = dates[0];
    if (newDueDate < todaysDate) {
      // alert them that their subscription has passed.
      // set next due date.
      newDueDate = addDays(newDueDate, occurence);

      try {
        await fetch(`${window.location.pathname}/subscriptions/${subscriptionUuid}`, {
          method: 'PATCH',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            dueDate: [newDueDate]
          })
        });
      } catch(error) {
        console.log('Error: ', error);
      }
    }
  }
};