import React from 'react';

class SubscriptionForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      nickname: '',
      dueDate: '',
      reminderDays: '',
      amount: 0,
      userId: 0,
    };

    this.createSubscription = this.createSubscription.bind(this);
  };

  handleChange(e, key) {
    e.preventDefault();
    this.setState({ [key]: e.target.value });
  }

  createSubscription(e) {
    e.preventDefault();

    const subscriptionInfo = this.state;
    try {
      fetch(`${window.location.pathname}/subscriptions/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscriptionInfo),
      });
    } catch(error) {
      console.log('Error creating subscription: ', error);
    }
  }

  render() {
    const { name, nickname, dueDate, reminderDays, amount, userId } = this.state;

    return (
      <section>
        State Here:
        Name: {name}
        Nickname: {nickname}
        Due Date: {dueDate}
        Reminder Days: {reminderDays}
        Amount: {amount}
        User Id: {userId}

        <form onSubmit={this.createSubscription}>
        <label htmlFor="subscription-name">
          Name:
          <input type="text" placeholder="Name" name="subscription-name" value={name} onChange={(e) => this.handleChange(e, 'name')}  />
        </label>

        <label htmlFor="subscription-nickname">
          Nickname:
          <input type="text" placeholder="Nickname" name="subscription-nickname" value={nickname} onChange={(e) => this.handleChange(e, 'nickname')}  /> 
        </label>

        <label htmlFor="subscription-due-date">
          Due Date: 
          <input type="date" name="subscription-dueDate" value={dueDate} onChange={(e) => this.handleChange(e, 'dueDate')} />
        </label>

        <label htmlFor="subscription-reminder-days">
          Reminder Days: 
          <input type="number" name="subscription-reminderDays" value={reminderDays} onChange={(e) => this.handleChange(e, 'reminderDays')} />
        </label>

        <label htmlFor="subscription-amount">
          Amount: 
          <input type="number" placeholder="Subscription Name" name="subscription-amount" value={amount} onChange={(e) => this.handleChange(e, 'amount')}  />
        </label>

        {/* Eventually, only the signed in user will be allowed to create a subcription for themself. This is for testing purposes. */}
        <label htmlFor="subscription-userId">
          User Id:
          <input type="number" name="subscription-userId" value={userId} onChange={(e) => this.handleChange(e, 'userId')}  /> 
        </label>

        <input type="submit" value="Create Subscription!" />
      </form>
      </section>
    )
  }

};

export default SubscriptionForm;