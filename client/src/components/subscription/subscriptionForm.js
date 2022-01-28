import React from 'react';
import { toast } from 'react-toastify';
import ReactDayPicker from '../utils/datepicker';

const WEEKLY_DAYS = {
  0: '2022-01-01T00:00:00',
  1: '2022-01-02T00:00:00',
  2: '2022-01-03T00:00:00',
  3: '2022-01-04T00:00:00',
  4: '2022-01-05T00:00:00',
  5: '2022-01-06T00:00:00',
  6: '2022-01-07T00:00:00',
};

function convertWeekDayToDate(datesArray) {
  return datesArray.map((weekDay) => WEEKLY_DAYS[weekDay]);   
}

const today = new Date();
const firstOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
function addDays(date, days) {
   const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Need to set the Weekly disabled days to only include today and the next 7 days
const seventhDay = addDays(firstOfThisMonth, 6);

class SubscriptionForm extends React.Component {
  constructor(props) {
    super(props);

    const { method, prevSubscription } = props;
    let parseDate;
    let updatedNickname;

    if (method === 'PATCH') {
      const { dueDate, nickname } = prevSubscription;
      const updatedDays = dueDate.frequency === 'weekly' ? convertWeekDayToDate(dueDate.dates) : dueDate.dates;
      parseDate = updatedDays.map((day) => new Date(day));
      updatedNickname = nickname || '';
    }

    this.state = {
      name: prevSubscription ? prevSubscription.name : '',
      nickname: prevSubscription ? updatedNickname : '',
      reminderDays: prevSubscription ? prevSubscription.reminderDays : 0,
      amount: prevSubscription ? prevSubscription.amount/100 : 0,
      frequency: prevSubscription ? prevSubscription.dueDate.frequency : '',
      occurence: prevSubscription ? prevSubscription.dueDate.occurence : 1,
      days: prevSubscription ? parseDate : []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDays = this.handleDays.bind(this);

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
    const { method, handleSubscriptions } = this.props;
    const { name, nickname, reminderDays, amount, frequency, occurence, days }  = this.state;

    if (frequency !== 'daily' && days.length === 0) {
      toast.error('Failed to Submit: Dates not selected for reminder.');
      return;
    }

    const dates = this.parseDueDate();
    const dueDate = { frequency, occurence, dates };

    const subscriptionInfo = { name, nickname, reminderDays, amount, dueDate };

    if (method === 'PATCH') {
      const { prevSubscription } = this.props;
      subscriptionInfo.subscriptionUuid = prevSubscription.subscriptionUuid;
    }

    const subscription = await fetch(`${window.location.pathname}/subscriptions`, {
      method,
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(subscriptionInfo)
    });

    const { status } = subscription;
    const response = await subscription.json();
    if (status === 400) {
      const { errorMessage } = response;
      toast.error(errorMessage);
      return;
    }
    toast.success('Successfully submitted subscription!');

    handleSubscriptions(response);
    if (method === 'PUT') {
      this.setState({ name: '', nickname: '', reminderDays: 0, amount: 0, frequency: '', occurence: 0, days: [] });
    }
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
        parsedDay = days.map((day) => day.getDate());
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
              <select id="occurence" placeholder="ex: Every 2 weeks" value={occurence} onChange={(event) => this.handleChange(event, 'occurence')}>
                <option value="1">Every Week</option>
                <option value="2">Every 2 Weeks</option>
                <option value="3">Every 3 Weeks</option>
                <option value="4">Every 4 Weeks</option>
              </select>
            </label>
            <div>Day of the week:</div>
            <ReactDayPicker disabledDays={{ after: seventhDay, before: firstOfThisMonth }} handleUpdate={this.handleDays} resetDays="weekly" updating={days} />
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
    const { method } = this.props;
    const { name, nickname, reminderDays, amount, frequency, days} = this.state;
    const daysList = days.map((day) => <div key={day}>{new Date(day).toDateString()}</div>);

    return (
      <section>
        <h2>{method === 'PUT' ? 'Create Subscription' : 'Update Subscription'}</h2>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="subscription-name">
            Name:
            <input type="text" placeholder="e.g. Crunchyroll" name="subscription-name" value={name} onChange={(event) => this.handleChange(event, 'name')} required />
          </label>

          <label htmlFor="subscription-nickname">
            Nickname:
            <input type="text" placeholder="e.g. My favorite streaming site"name="subscription-nickname" value={nickname} onChange={(event) => this.handleChange(event, 'nickname')}  /> 
          </label>

          <label htmlFor="subscription-reminder-days">
            Reminder Days: 
            <input type="number" name="subscription-reminder-days" min="0" value={reminderDays} onChange={(event) => this.handleChange(event, 'reminderDays')} required />
          </label>

          <label htmlFor="due-date-select">
            Repeat:
            <select id="due-date-select" value={frequency} onChange={(event) => this.handleChange(event, 'frequency')} required >
              <option value="" defaultValue>--Please Choose an Option--</option>
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
            <input type="number" name="subscription-amount" min="0" step="0.01" value={amount} onChange={(event) => this.handleChange(event, 'amount')} required />
          </label>

          <input type="submit" value="Submit" />
        </form>
      </section>
    );
  }
};

export default SubscriptionForm;