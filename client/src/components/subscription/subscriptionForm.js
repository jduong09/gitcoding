import React from 'react';

/** TO DO
 * Indicator if the form is correctly or incorrectly filled out.
 * We don't need to require the userId as state. This should be filled in auto because route for creating is /user/:userUUID/subscriptions
 * After creating a subscription, we need to reset all the input values to normal.
*/

class SubscriptionForm extends React.Component {
  constructor(props) {
    super(props);

    // When a field is empty, and not required, it should save as NULL instead of an empty string.
    this.state = {
      name: '',
      nickname: '',
      dueDate: '',
      reminderDays: '',
      amount: 0,
      userId: 0,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  };

  handleChange(e, key) {
    e.preventDefault();
    this.setState({ [key]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();

    const subscriptionInfo = this.state;
    try {
      fetch(`${window.location.pathname}/subscriptions`, {
        method: 'PUT',
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

        <form onSubmit={this.handleSubmit}>
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