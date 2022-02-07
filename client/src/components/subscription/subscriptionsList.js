import React from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Subscription from './subscription';
import UpdateSubscription from './updateSubscription';
import CreateSubscription from './createSubscription';

class SubscriptionsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      subscriptions: [],
      addingSubscription: false,
      editingSubscription: null,
    };

    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.showSubscriptionList = this.showSubscriptionList.bind(this);
    this.toggleLoadingState = this.toggleLoadingState.bind(this);
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
    // Here we gather all the user's subscriptions.
    const response = await allSubscriptions.json();
    setTimeout(() => {
      this.setState({ subscriptions: response, loading: false });
    }, 1000); // This is probably not necessary but in local provides perceived loading since the DB calls are instant
  }

  async componentDidUpdate(prevState) {
    const { subscriptions } = this.state;
    if (prevState.subscriptions !== subscriptions) {
      await fetch(`${window.location.pathname}/subscriptions/update`);
    }
  }

  handleUpdate = async (newSubscriptionsList) => {
    await this.setState({ subscriptions: newSubscriptionsList });
  }

  handleDelete = async (subscriptionUuid) => {
    this.toggleLoadingState();
    const deleteSubscription = await fetch(`${window.location.pathname}/subscriptions/${subscriptionUuid}`, {
        method: 'DELETE'
    });

    const { status } = deleteSubscription;
    const response = await deleteSubscription.json();
    this.toggleLoadingState();
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

  showSubscriptionList() {
    this.setState({ addingSubscription: false, editingSubscription: null });
  }

  toggleLoadingState() {
    const { loading } = this.state;
    if (loading) {
      setTimeout(() => {
        this.setState({ loading: false });
      }, 1000); // Perceived loading to avoid the "jumpiness" of immediate fetch requsts
    } else {
      this.setState({ loading: true });
    }
  };

  render() {
    const {
      loading,
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
              <Subscription details={subscription} handleEdit={() => this.setState({ editingSubscription: subscriptionUuid, addingSubscription: false })} handleDelete={() => this.handleDelete(subscriptionUuid)} />
            </div>
          }
          {editingSubscription === subscriptionUuid && 
            <div className="card p-3 m-2 d-flex flex-wrap">
              <UpdateSubscription
                updateSubscription={this.handleUpdate}
                showSubscriptionList={this.showSubscriptionList}
                toggleLoadingState={this.toggleLoadingState}
                prevSubscription={subscription} />
              <button onClick={() => this.setState({ editingSubscription: null })} className="btn btn-link my-2" type="button">Cancel</button>
            </div>
            }
        </div>
      );
    });

    const addSubscriptionTemplates = addingSubscription
      ? <div className="card p-3 m-2 d-flex flex-column">
          <CreateSubscription 
            addSubscription={this.handleUpdate}
            toggleLoadingState={this.toggleLoadingState}
            showSubscriptionList={this.showSubscriptionList}
            currentSubscriptions={subscriptions} />
          <button onClick={() => this.setState({ addingSubscription: !addingSubscription })} className="btn btn-link my-2" type="button">Cancel</button>
        </div>
      : <button onClick={() => this.setState({ addingSubscription: !addingSubscription, editingSubscription: null })} className="btn btn-primary my-2" type="button">Add New Subscription</button>;

    return (
      <section className="subscription-list p-3">
        {loading
          ? <div className="d-flex flex-column justify-content-center align-items-center fs-1">
            <FontAwesomeIcon icon={faSpinner} className="mb-2 spin" />
            Loading...
            </div>
          : <div>
              <div className="d-flex flex-wrap">
                {!addingSubscription && subscriptionsList}
              </div>
              {!editingSubscription && addSubscriptionTemplates}
            </div>
        }
      </section>
    );
  }
}

export default SubscriptionsList;