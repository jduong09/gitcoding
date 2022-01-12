import React from 'react';

/** TO DO
 * Indicator if the form is correctly or incorrectly filled out. (done in dev, need to be done in prod)
 * We don't need to require the userId as state. This should be filled in auto because route for creating is /user/:userUUID/subscriptions (done)
 * After creating a subscription, we need to reset all the input values to normal. (done)
*/

class SubscriptionForm extends React.Component {
  constructor(props) {
    super(props);

    // When a field is empty, and not required, it should save as NULL instead of an empty string.
    this.state = {
      name: '',
      nickname: '',
      dueDate: '',
      reminderDays: 0,
      amount: 0,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  };

  handleChange(e, key) {
    e.preventDefault();
    this.setState({ [key]: e.target.value });
  }

  async handleSubmit(e) {
    e.preventDefault();

    const subscriptionInfo = this.state;
    try {
      await fetch(`${window.location.pathname}/subscriptions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscriptionInfo),
      }).then(() => alert('Successfully added subscription! Refresh page.'));
    } catch(error) {
      alert('Error Creating Subscription: ', error);
    }
    this.setState({ name: '', nickname: '', dueDate: '', reminderDays: 0, amount: 0 })
  }

  render() {
    const { name, nickname, dueDate, reminderDays, amount } = this.state;

    return (
      <section>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="subscription-name">
            Name:
            <input type="text" name="subscription-name" value={name} onChange={(e) => this.handleChange(e, 'name')}  />
          </label>

          <label htmlFor="subscription-nickname">
            Nickname:
            <input type="text" name="subscription-nickname" value={nickname} onChange={(e) => this.handleChange(e, 'nickname')}  /> 
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
            <input type="number" name="subscription-amount" value={amount} onChange={(e) => this.handleChange(e, 'amount')}  />
          </label>

          <input type="submit" value="Create Subscription!" />
        </form>
      </section>
    )
  }

};

export default SubscriptionForm;