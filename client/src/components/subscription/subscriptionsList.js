import React from 'react';
import { toast } from 'react-toastify';
import Subscription from './subscription';
import UpdateSubscription from './updateSubscription';
import CreateSubscription from './createSubscription';

class SubscriptionsList extends React.Component {
  constructor() {
    super();

    this.state = {
      subscriptions: [],
      addingSubscription: false,
      editingSubscription: null,
    };

    this.handleDelete = this.handleDelete.bind(this);
  }

  async componentDidMount() {
    const allSubscriptions = await fetch(`${window.location.pathname}/subscriptions`);
    const { status } = allSubscriptions;

    if (status === 404) {
      window.location = '/not-found';
    }

    if (status === 400) {
      toast.error('Error: Error getting your subscriptions!');
      return;
    }

    const response = await allSubscriptions.json();
    this.setState({ subscriptions: response });
  }

  handleUpdate = (newSubscriptionsList) => {
    this.setState({ subscriptions: newSubscriptionsList });
  }

  handleDelete = async (subscriptionUuid) => {
    const deleteSubscription = await fetch(`${window.location.pathname}/subscriptions/${subscriptionUuid}`, {
        method: 'DELETE'
    });

    const { status } = deleteSubscription;
    const response = await deleteSubscription.json();
    if (status === 400) {
      const { errorMessage } = response;
      toast.error(errorMessage);
      return;
    }

    toast.success(response);
    
    const { subscriptions } = this.state;
    const updatedSubscriptionsList = await subscriptions.filter(subscription => subscription.subscriptionUuid !== subscriptionUuid);

    this.setState({ subscriptions: updatedSubscriptionsList });
  } 
  
  render() {
    const {
      subscriptions,
      addingSubscription,
      editingSubscription
    } = this.state;

    const subscriptionsList = subscriptions.map((subscription) => {
      const { subscriptionUuid } = subscription;
      return (
        <div key={subscriptionUuid} className="m-2">
          {!editingSubscription &&
            <div className="d-flex align-items-center flex-wrap">
              <Subscription details={subscription} handleEdit={() => this.setState({ editingSubscription: subscriptionUuid})} handleDelete={() => this.handleDelete(subscriptionUuid)} />
            </div>
          }
          {editingSubscription === subscriptionUuid && 
            <div className="card p-3 m-2 d-flex flex-wrap">
              <UpdateSubscription updateSubscription={this.handleUpdate} currentSubscriptions={subscriptions} prevSubscription={subscription} />
              <button onClick={() => this.setState({ editingSubscription: null })} className="btn btn-link my-2" type="button">Cancel</button>
            </div>
            }
        </div>
      );
    });

    return (
      <section className="subscription-list p-3">
        <div className="d-flex flex-wrap">{subscriptionsList}</div>
        {
          addingSubscription
            ? <div className="card p-3 m-2 d-flex flex-column">
                <CreateSubscription addSubscription={this.handleUpdate} currentSubscriptions={subscriptions} />
                <button onClick={() => this.setState({ addingSubscription: !addingSubscription })} className="btn btn-link my-2" type="button">Cancel</button>
              </div>
            : <button onClick={() => this.setState({ addingSubscription: !addingSubscription })} className="btn btn-primary my-2" type="button">Add New Subscription</button>
        }
      </section>
    );
  }
}

export default SubscriptionsList;