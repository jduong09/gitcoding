import React from 'react';
import { toast } from 'react-toastify';
import ReactDayPicker from '../utils/datepicker';


const date = new Date();
const todaysDate = date.toISOString().substring(0, 10);

class CreateSubscription extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      nickname: '',
      dueDate: todaysDate,
      reminderDays: 0,
      amount: 0,
      dueDateOption: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubscriptions = this.handleSubscriptions.bind(this);
    this.addSelectedDay = this.addSelectedDay.bind(this);
  }

  async handleSubscriptions(subscription) {
    const { addSubscription, currentSubscriptions } = this.props;

    const newSubscriptionList = [ ...currentSubscriptions, subscription];
    addSubscription(newSubscriptionList);
  }

  handleChange(event, key) {
    const { value } = event.target;
    event.preventDefault();
    this.setState({ [key]: value });
  }

  async handleSubmit(event) {
    event.preventDefault();

    const subscriptionInfo  = this.state;

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
    this.setState({ name: '', nickname: '', dueDate: todaysDate, reminderDays: 0, amount: 0 });
  }

  addSelectedDay(e) {
    console.log('hey');
    console.log(`Selected ${e.target}.`, this);
  }

  renderSwitch(frequency) {
    console.log(this);
    switch (frequency) {
      case 'yearly':
        return (
          <div>
            On what day do you want to be reminded?
            <ReactDayPicker />
          </div>
        );
      case 'monthly':
        return (
          <div>
             <label htmlFor="occurence">
                How many months in between do you want to be reminded?
                <input type="number" id="occurence" />
              </label>
              <div>On What day(s) do you want to be reminded?</div>
              <ReactDayPicker />
          </div>
        );
      case 'weekly':
        return (
          <div>
            <label htmlFor="occurence">
              How many weeks in between do you want to be reminded?
              <input type="number" id="occurence" />
            </label>
            <div>On what day(s) do you want to be reminded?</div>
            <ReactDayPicker />
          </div>
        );
      case 'daily':
        return (
          <label htmlFor="occurence">
            How many days do you want to be reminded? ex: (every 2 days)
            <input type="number" id="occurence" />
          </label>
        );
      default:
        return ('');
    }
  }

  render() {
    const { name, nickname, dueDate, reminderDays, amount, dueDateOption } = this.state;

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

          <label htmlFor="subscription-due-date">
            Due Date: 
            <input type="date" name="subscription-due-date" value={dueDate} onChange={(event) => this.handleChange(event, 'dueDate')} required />
          </label>

          <label htmlFor="subscription-reminder-days">
            Reminder Days: 
            <input type="number" name="subscription-reminder-days" min="0" value={reminderDays} onChange={(event) => this.handleChange(event, 'reminderDays')} required />
          </label>

          { /* Due_Date changes to jsonb Object 
              {
                "frequency": ['yearly', 'monthly', 'daily'] SELECT HTML TAG.
                "occurence": How frequent do you want reminders on your due_date? UI is dependent on frequency.
                "days": Which day(s) do you want to be reminded? Dependent on frequency.
              }
          */}

          <label htmlFor="due-date-select">
            Repeat:
            <select onChange={(event) => this.handleChange(event, 'dueDateOption')} id="due-date-select">
              <option value="" defaultValue>--Please Choose an Option--</option>
              <option value="yearly">Yearly</option>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
            </select>  
          </label>

          {this.renderSwitch(dueDateOption)}
          
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