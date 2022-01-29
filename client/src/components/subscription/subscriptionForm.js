import React from 'react';
import { toast } from 'react-toastify';
import ReactDayPicker from '../utils/datepicker';

function convertStringToDate(datesArray) {
  return datesArray.map((day) => new Date(day));   
};

class SubscriptionForm extends React.Component {
  constructor(props) {
    super(props);

    const { method, prevSubscription } = props;
    let parseDate = prevSubscription ? prevSubscription.dueDate.dates : null;
    let updatedNickname;

    if (method === 'PATCH') {
      const { dueDate, nickname } = prevSubscription;
      parseDate = dueDate.frequency === 'yearly' || dueDate.frequency === 'monthly' ? convertStringToDate(dueDate.dates) : dueDate.dates;
      updatedNickname = nickname || '';
    }

    this.state = {
      name: prevSubscription ? prevSubscription.name : '',
      nickname: prevSubscription ? updatedNickname : '',
      reminderDays: prevSubscription ? prevSubscription.reminderDays : 0,
      amount: prevSubscription ? prevSubscription.amount/100 : 0,
      frequency: prevSubscription ? prevSubscription.dueDate.frequency : '',
      occurence: prevSubscription ? prevSubscription.dueDate.occurence : 1,
      days: parseDate || '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDays = this.handleDays.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }

  handleChange(event, key) {
    const { value } = event.target;
    event.preventDefault();

    if (key === 'frequency') {
      if (value === 'yearly') {
        return this.setState({ [key]: value, days: [], occurence: 1 });
      }
      return this.setState({ [key]: value, days: [] });
    }

    return this.setState({ [key]: value });
  }

  handleCheck(event) {
    const { days } = this.state;
    const { checked, value } = event.target;
    let updatedList = days;
    if (checked) {
      updatedList = [ ...days, value];
    } else {
      updatedList.splice(days.indexOf(value), 1);
    }
    this.setState({ days: updatedList });
  }

  // Need to set occurence to 1 if user updates their dueDate column to yearly.
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
        parsedDay = days;
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
    const weeklyCheckbox = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, idx) => 
      <label htmlFor={day} key={day}>
        {day}:
        <input type="checkbox" id={day} name={days} value={idx} onChange={this.handleCheck} checked={days.includes(idx.toString())}/>
      </label>
    );

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
            <div>{weeklyCheckbox}</div>
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
    const { name, nickname, reminderDays, amount, frequency } = this.state;

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