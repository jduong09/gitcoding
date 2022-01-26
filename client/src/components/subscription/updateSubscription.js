import React from 'react';
import { toast } from 'react-toastify';
import ReactDayPicker from '../utils/datepicker';

const WEEKLY_DAYS = {
  0: '2022-01-02T00:00:00',
  1: '2022-01-03T00:00:00',
  2: '2022-01-04T00:00:00',
  3: '2022-01-05T00:00:00',
  4: '2022-01-06T00:00:00',
  5: '2022-01-07T00:00:00',
  6: '2022-01-08T00:00:00',
};

function convertWeekDayToDate(datesArray) {
  return datesArray.map((weekDay) => WEEKLY_DAYS[weekDay]);   
}

class UpdateSubscription extends React.Component {
  constructor(props) {
    super(props);
    const { prevSubscription } = props;
    const { dueDate } = prevSubscription;
    const updatedDays = dueDate.frequency === 'weekly' ? convertWeekDayToDate(dueDate.dates) : dueDate.dates;
    this.state = {
      name: prevSubscription.name || '', 
      nickname: prevSubscription.nickname || '', 
      reminderDays: prevSubscription.reminderDays || 0,
      amount: prevSubscription.amount/100 || 0,
      frequency: dueDate.frequency || '',
      occurence: dueDate.occurence || 1,
      days: updatedDays || []
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubscriptions = this.handleSubscriptions.bind(this);
    this.handleDays = this.handleDays.bind(this);
  }

  async handleSubscriptions() {
    const { updateSubscription } = this.props;

    const newSubscriptionList = await fetch(`${window.location.pathname}/subscriptions`);
    
    const { status } = newSubscriptionList;
    const response = await newSubscriptionList.json();
    if (status === 400) {
      toast.error('Error: Error fetching your updated subscription!');
      return;
    }

    updateSubscription(response);
    toast.success('Successfully updated your subscription!');
  }

  handleChange(event, key) {
    const { value } = event.target;
    event.preventDefault();

    if (key === 'frequency') {
      return this.setState({ [key]: value, days: [] });
    }

    return this.setState({ [key]: value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { prevSubscription } = this.props;
    const { name, nickname, reminderDays, amount, frequency, occurence, days } = this.state;

    if (days.length === 0) {
      toast.error('Failed to Update: Dates not selected for reminder.');
      return;
    }
    const dates = this.parseDueDate();
    const dueDate = { frequency, occurence, dates };


    const updatedSubscriptionForm = { name, nickname, reminderDays, amount, dueDate, subscriptionUuid: prevSubscription.subscriptionUuid };

    const updatedSubscription = await fetch(`${window.location.pathname}/subscriptions`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedSubscriptionForm)
    });

    const { status } = updatedSubscription;
    if (status === 400 ) {
      const { errorMessage } = await updatedSubscription.json();
      toast.error(errorMessage);
      return;
    };

    this.handleSubscriptions();
  }

  handleDays(days) {
    this.setState({ days });
  }

  parseDueDate() {
    const { frequency, days } = this.state;
    let parsedDay;
    switch (frequency) {
      case 'yearly':
        parsedDay = days.map((day) => day.toISOString());
        break;
      case 'monthly':
        parsedDay = days.map((day) => day.toISOString());
        break;
      case 'weekly':
        parsedDay = days.map((day) => day.getDay());
        break;
      case 'daily':
        parsedDay = null;
        break;
      default:
        break;
    }
    return parsedDay;
  }

  renderSwitch(frequency) {
    const { occurence, days } = this.state;

    switch (frequency) {
      case 'yearly':
        return (
          <div>
            On what day do you want to be reminded?
            <ReactDayPicker handleUpdate={this.handleDays} resetDays="yearly" updating={days} />
          </div>
        );
      case 'monthly':
        return (
          <div>
             <label htmlFor="occurence">
                Every (?) Months:
                <input type="number" id="occurence" value={occurence} onChange={(event) => this.handleChange(event, 'occurence')} min="0" max="12" />
              </label>
              <div>On What day(s) do you want to be reminded?</div>
              <ReactDayPicker handleUpdate={this.handleDays} resetDays="monthly" updating={days} />
          </div>
        );
      case 'weekly':
        return (
          <div>
            <label htmlFor="occurence">
              How many weeks in between do you want to be reminded?
              <select id="occurence" placeholder="ex: Every 2 weeks" onChange={(event) => this.handleChange(event, 'occurence')}>
                <option value="1">Every Week</option>
                <option value="2">Every 2 Weeks</option>
                <option value="3">Every 3 Weeks</option>
                <option value="4">Every 4 Weeks</option>
              </select>
            </label>
            <div>Day of the week:</div>
            <ReactDayPicker disabledDays={{ after: new Date(2022, 0, 8), before: new Date(2022, 0, 2) }} handleUpdate={this.handleDays} resetDays="weekly" updating={days} />
          </div>
        );
      case 'daily':
        return (
          <label htmlFor="occurence">
            Every:
            <input type="number" id="occurence" value={occurence} onChange={(event) => this.handleChange(event, 'occurence')} />
          </label>
        );
      default:
        return ('');
    }
  }

  render() {
    const { name, nickname, reminderDays, amount, frequency, days } = this.state;
    const daysList = days.map((day) => <div key={day}>{new Date(day).toDateString()}</div>);
    return (
      <form onSubmit={this.handleSubmit}>
          <label htmlFor="subscription-name">
            Name:
            <input type="text" name="subscription-name" value={name} onChange={(event) => this.handleChange(event, 'name')}  />
          </label>

          <label htmlFor="subscription-nickname">
            Nickname:
            <input type="text" name="subscription-nickname" value={nickname} onChange={(event) => this.handleChange(event, 'nickname')}  /> 
          </label>

          <label htmlFor="subscription-reminder-days">
            Reminder Days: 
            <input type="number" name="subscription-reminder-days" min="0" value={reminderDays} onChange={(event) => this.handleChange(event, 'reminderDays')} />
          </label>

          <label htmlFor="subscription-due-date">
            Repeat:
            <select onChange={(event) => this.handleChange(event, 'frequency')} id="subscription-due-date" value={frequency}>
              <option value="yearly">Yearly</option>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
            </select>
          </label>

          {this.renderSwitch(frequency)}
          
          Days List: {daysList}

          <label htmlFor="subscription-amount">
            Amount: 
            <input type="number" name="subscription-amount" min="0" step="0.01" value={amount} onChange={(event) => this.handleChange(event, 'amount')} />
          </label>

          <input type="submit" value="Submit" />
        </form>
    );
  }
};

export default UpdateSubscription;