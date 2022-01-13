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
      due_date: '',
      reminder_days: '',
      amount: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  };

  handleChange(e, key) {
    e.preventDefault();
    this.setState({ [key]: e.target.value });
  }

  async handleSubmit(e) {
    e.preventDefault();

    const subscriptionInfo  = this.state;
    const { performUpdate } = this.props;
    const httpMethod = performUpdate ? 'PATCH' : 'PUT';
    console.log('FRONT END subscription: ', performUpdate);
    console.log('THIS.STATE: ', subscriptionInfo);

    if (performUpdate) {
      Object.keys(performUpdate).forEach(key => {
        if (subscriptionInfo[key] === '') {
          subscriptionInfo[key] = performUpdate[key];
        }
      });

      subscriptionInfo.uuid = performUpdate.subscription_uuid;
    }

    console.log('UPDATED.STATE: ', subscriptionInfo);

    // User wants to update their subscription.
    // perform update contains the subscription row, including subscription_uuid.

    try {
      await fetch(`${window.location.pathname}/subscriptions`, {
        method: httpMethod,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscriptionInfo)
      }).then(() => alert('Successfully added subscription! Refresh page.'));
    } catch(error) {
      alert('Error Creating Subscription: ', error);
    }
    this.setState({ name: '', nickname: '', due_date: '', reminder_days: 0, amount: 0 })
  }

  render() {
    const { performUpdate } = this.props;
    const { name, nickname, due_date, reminder_days, amount } = this.state;

    return (
      <section>
        {!performUpdate ? <h2>Create Subscription</h2> : <h2>Update Subscription</h2>}
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
            <input type="date" name="subscription-due-date" value={due_date} onChange={(e) => this.handleChange(e, 'due_date')} />
          </label>

          <label htmlFor="subscription-reminder-days">
            Reminder Days: 
            <input type="number" name="subscription-reminder-days" value={reminder_days} onChange={(e) => this.handleChange(e, 'reminder_days')} />
          </label>

          <label htmlFor="subscription-amount">
            Amount: 
            <input type="number" name="subscription-amount" value={amount} onChange={(e) => this.handleChange(e, 'amount')}  />
          </label>

          <input type="submit" value={!performUpdate ? 'Create Subscription' : 'Update Subscription'} />
        </form>
      </section>
    )
  }

};

export default SubscriptionForm;