import React from 'react';

/** TODO
 * Indicator if the form is correctly or incorrectly filled out. (done in dev, need to be done in prod)
 * We don't need to require the userId as state. This should be filled in auto because route for creating is /user/:userUUID/subscriptions (done)
 * After creating a subscription, we need to reset all the input values to normal. (done)
*/

class SubscriptionForm extends React.Component {
  constructor(props) {
    // Has updateSubscriptions, currentSubscriptions, performUpdate in this.props;
    super(props);

    // When a field is empty, and not required, it should save as NULL instead of an empty string.
    this.state = {
      name: '',
      nickname: '',
      due_date: '',
      reminder_days: 0,
      amount: 0,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubscriptions = this.handleSubscriptions.bind(this);
  };

  componentDidUpdate(prevProps) {
    const { performUpdate } = this.props;
    const { name, nickname, due_date, reminder_days, amount } = performUpdate;
    if (performUpdate && prevProps.performUpdate !== performUpdate) {
      this.setState({ name, nickname, due_date, reminder_days, amount });
    }
  }

  async handleSubscriptions(subscription) {
    const { updateSubscriptions, currentSubscriptions, performUpdate } = this.props;
    let newSubscriptionList;
    // if subscriptionForm is updating a subscription
    if (performUpdate) {
       // make call to grab all the subscriptions (receives updated subscriptions)
      newSubscriptionList = await fetch(`${window.location.pathname}/subscriptions`).then(data => data.json());
    } else {
       // If we get to here, then subscriptionForm is creating a subscription
      newSubscriptionList = [ ...currentSubscriptions, subscription];
    }
    // Set parent state 'subscriptions' to our new updated subscription list
    updateSubscriptions(newSubscriptionList);
  }

  handleChange(event, key) {
    event.preventDefault();
    const { value } = event.target;
    this.setState({ [key]: value });
  }

  async handleSubmit(e) {
    e.preventDefault();

    const subscriptionInfo  = this.state;
    const { performUpdate } = this.props;
    const httpMethod = performUpdate ? 'PATCH' : 'PUT';
    let subscription;

    subscriptionInfo.uuid = performUpdate.subscription_uuid;
    try {
      subscription = await fetch(`${window.location.pathname}/subscriptions`, {
        method: httpMethod,
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(subscriptionInfo)
      }).then(data => data.json());
    } catch(error) {
      alert('Error Creating Subscription: ', error);
    }

    this.handleSubscriptions(subscription);
    this.setState({ name: '', nickname: '', due_date: '', reminder_days: 0, amount: 0 });
  }

  render() {
    const { performUpdate } = this.props;
    const { name, nickname, due_date, reminder_days, amount } = this.state;

    return (
      <section>
        {performUpdate ? <h2>Update Subscription</h2> : <h2>Create Subscription</h2>}
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
            <input type="date" name="subscription-due-date" value={due_date} onChange={(event) => this.handleChange(event, 'due_date')} />
          </label>

          <label htmlFor="subscription-reminder-days">
            Reminder Days: 
            <input type="number" name="subscription-reminder-days" value={reminder_days} onChange={(event) => this.handleChange(event, 'reminder_days')} />
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

export default SubscriptionForm;