import React from 'react';
import { toast } from 'react-toastify';

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
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubscriptions = this.handleSubscriptions.bind(this);
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

    await fetch(`${window.location.pathname}/subscriptions`, {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(subscriptionInfo)
    }).then(data => {
      if (data.status === 400) {
        console.log('hey');
        throw new Error(`OH NO! ${data.json()}`);
      }

      toast.success('Successfully created subscription!');
      return data.json();
    }).catch((error) => {
      console.log(error);
      toast.error(error);
    });

    // this.handleSubscriptions(subscription);
    // this.setState({ name: '', nickname: '', dueDate: '', reminderDays: 0, amount: 0 });
  }

  render() {
    const { name, nickname, dueDate, reminderDays, amount } = this.state;

    return (
      <section>
        <h2>Create Subscription</h2>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="subscription-name">
            Name:
            <input type="text" name="subscription-name" value={name} onChange={(event) => this.handleChange(event, 'name')}  />
          </label>

          <label htmlFor="subscription-nickname">
            Nickname:
            <input type="text" name="subscription-nickname" value={nickname} onChange={(event) => this.handleChange(event, 'nickname')}  /> 
          </label>

          <label htmlFor="subscription-due-date">
            Due Date: 
            <input type="date" name="subscription-due-date" value={dueDate} onChange={(event) => this.handleChange(event, 'dueDate')} />
          </label>

          <label htmlFor="subscription-reminder-days">
            Reminder Days: 
            <input type="number" name="subscription-reminder-days" value={reminderDays} onChange={(event) => this.handleChange(event, 'reminderDays')} />
          </label>

          <label htmlFor="subscription-amount">
            Amount: 
            <input type="number" name="subscription-amount" step="0.01" value={amount} onChange={(event) => this.handleChange(event, 'amount')} />
          </label>

          <input type="submit" value="Submit" />
        </form>
      </section>
    );
  }
};

export default CreateSubscription;