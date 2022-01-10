import React from 'react';

class SubscriptionForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      nickname: '',
      due_date: '',
      reminder_days: '',
      amount: 0,
      user_id: null
    };
  };

  handleChange(key, e) {
    e.preventDefault();

    this.setState({ [key]: e.target.value });
  }

  createSubscription() {
    e.preventDefault();

    const subscriptionInfo = this.state;

    fetch('/new', {
      method: 'POST',
      body: subscriptionInfo,
    });
  }

  render() {
    <form onSubmit={this.createSubscription}>
      <label for="subscription-name">
        Name:
        <input type="text" placeholder="Name" name="subscription-name" onChange={this.handleChange('name')}  />
      </label>

      <label for="subscription-nickname">
        Nickname:
        <input type="text" placeholder="Nickname" name="subscription-nickname" onChange={this.handleChange('nickname')}  /> 
      </label>

      <label for="subscription-due-date">
        Due Date: 
        <input type="date" name="subscription-due-date" onChange={this.handleChange('due_date')} />
      </label>

      <label for="subscription-reminder-days">
        Reminder Days: 
        <input type="number" name="subscription-reminder-days" onChange={this.handleChange('reminder_days')} />
      </label>

      <label for="subscription-amount">
        Amount: 
        <input type="number" placeholder="Subscription Name" name="subscription-amount" onChange={this.handleChange('amonut')}  />
      </label>

      {/* Eventually, only the signed in user will be allowed to create a subcription for themself. This is for testing purposes. */}
      <label for="subscription-user-id">
        User Id:
        <input type="number" name="subscription-user-id" onChange={this.handleChange('user_id')}  /> 
      </label>

      <input type="submit" value="Create Subscription!" />
    </form>
  }

};

export default SubscriptionForm;