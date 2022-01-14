import React from 'react';

/** TODO
 * Indicator if the form is correctly or incorrectly filled out. (done in dev, need to be done in prod)
 * We don't need to require the userId as state. This should be filled in auto because route for creating is /user/:userUUID/subscriptions (done)
 * After creating a subscription, we need to reset all the input values to normal. (done)
*/

class CreateSubscription extends React.Component {
  constructor(props) {
    // Has addSubscription, currentSubscriptions in this.props;
    super(props);

    // When a field is empty, and not required, it should save as NULL instead of an empty string.
    this.state = {
      name: '',
      nickname: '',
      dueDate: '',
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
    // Set parent state 'subscriptions' to our new updated subscription list
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
    let subscription;

    try {
      subscription = await fetch(`${window.location.pathname}/subscriptions`, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(subscriptionInfo)
      }).then(data => data.json());
    } catch(error) {
      alert('Error Creating Subscription: ', error);
    }

    this.handleSubscriptions(subscription);
    // set Create Form back to null. 
    this.setState({ name: '', nickname: '', dueDate: '', reminderDays: 0, amount: 0 });
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
            <input type="number" name="subscription-amount" value={amount} onChange={(event) => this.handleChange(event, 'amount')} />
          </label>

          <input type="submit" value="Submit" />
        </form>
      </section>
    );
  }
};

export default CreateSubscription;