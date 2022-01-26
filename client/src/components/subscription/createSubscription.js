import React from 'react';
import { toast } from 'react-toastify';
import ReactDayPicker from '../utils/datepicker';

class CreateSubscription extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      nickname: '',
      reminderDays: 0,
      amount: 0,
      frequency: '',
      occurence: 1,
      days: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubscriptions = this.handleSubscriptions.bind(this); 
    this.handleDays = this.handleDays.bind(this);
  }

  async handleSubscriptions(subscription) {
    const { addSubscription, currentSubscriptions } = this.props;

    const newSubscriptionList = [ ...currentSubscriptions, subscription];
    addSubscription(newSubscriptionList);
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
    const { name, nickname, reminderDays, amount, frequency, occurence, days }  = this.state;

    if (days.length === 0) {
      toast.error('Failed to Create: Dates not selected for reminder.');
      return;
    }
    const dates = this.parseDueDate();
    const dueDate = { frequency, occurence, dates };

    const subscriptionInfo = { name, nickname, reminderDays, amount, dueDate };

    const subscription = await fetch(`${window.location.pathname}/subscriptions`, {
      method: 'PUT',
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
    toast.success('Successfully created subscription!');

    this.handleSubscriptions(response);
    this.setState({ name: '', nickname: '', reminderDays: 0, amount: 0, frequency: '', occurence: 0, days: []});
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
    const { occurence } = this.state;

    switch (frequency) {
      case 'yearly':
        return (
          <div>
            On what day do you want to be reminded?
            <ReactDayPicker handleUpdate={this.handleDays} resetDays="yearly" />
          </div>
        );
      case 'monthly':
        return (
          <div>
             <label htmlFor="occurence">
                Every (?) Months:
                <input type="number" id="occurence" value={occurence} onChange={(event) => this.handleChange(event, 'occurence')} min="0" max="12" required />
              </label>
              <div>On What day(s) do you want to be reminded?</div>
              <ReactDayPicker handleUpdate={this.handleDays} resetDays="monthly" />
          </div>
        );
      case 'weekly':
        return (
          <div>
            <label htmlFor="occurence">
              How many weeks in between do you want to be reminded?
              <select id="occurence" placeholder="ex: Every 2 weeks" onChange={(event) => this.handleChange(event, 'occurence')} required >
                <option value="1">Every Week</option>
                <option value="2">Every 2 Weeks</option>
                <option value="3">Every 3 Weeks</option>
                <option value="4">Every 4 Weeks</option>
              </select>
            </label>
            <div>Day of the week:</div>
            <ReactDayPicker disabledDays={{ after: new Date(2022, 0, 8), before: new Date(2022, 0, 2) }} handleUpdate={this.handleDays} resetDays="weekly" />
          </div>
        );
      case 'daily':
        return (
          <label htmlFor="occurence">
            Every:
            <input type="number" id="occurence" value={occurence} onChange={(event) => this.handleChange(event, 'occurence')} required />
          </label>
        );
      default:
        return ('');
    }
  }

  render() {
    const { name, nickname, reminderDays, amount, days, frequency } = this.state;
    const daysList = days.map((day) => <div key={day.getDate()}>{day.toDateString()}</div>);

    return (
      <section>
        <h2>Create Subscription</h2>
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
            <select onChange={(event) => this.handleChange(event, 'frequency')} id="due-date-select" required >
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

export default CreateSubscription;