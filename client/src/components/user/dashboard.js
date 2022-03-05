import React from 'react';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';
import NewSubscriptionsList from '../subscription/newSubscriptionsList';
import logo from '../../assets/watering-can.png';
import UpdateSubscription from '../subscription/updateSubscription';
import CreateSubscription from '../subscription/createSubscription';

const href = process && process.env && process.env.NODE_ENV === 'production'
  ? '/auth/logout'
  : 'http://localhost:5000/auth/logout';

// logo: https://www.flaticon.com/free-icon/watering-can_5268400?term=watering%20can&page=1&position=73&page=1&position=73&related_id=5268400&origin=tag
class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dueDates: [],
      loading: false,
      addingSubscription: false,
      editingSubscription: null,
    };

    this.updateDueDates = this.updateDueDates.bind(this);
  };

  handleUpdate = async (newSubscriptionsList) => {
    await this.setState({ subscriptions: newSubscriptionsList });
  }

  /*
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
  */

  updateDueDates(dueDates) {
    this.setState({ dueDates });
  };

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
    const { name, pfp } = this.props;
    const { dueDates, loading, subscriptions, addingSubscription, editingSubscription } = this.state;

    const subscriptionForm = addingSubscription
      ? <div className="card p-3 m-2 d-flex flex-column">
          <CreateSubscription 
          addSubscription={this.handleUpdate}
          toggleLoadingState={this.toggleLoadingState}
          showSubscriptionList={this.showSubscriptionList}
          currentSubscriptions={subscriptions} />
          <button onClick={() => this.setState({ addingSubscription: !addingSubscription })} className="btn btn-link my-2" type="button">Cancel</button>
        </div>
      : <div className="card p-3 m-2 d-flex flex-wrap">
          <UpdateSubscription
          updateSubscription={this.handleUpdate}
          showSubscriptionList={this.showSubscriptionList}
          toggleLoadingState={this.toggleLoadingState}
          />
          <button onClick={() => this.setState({ editingSubscription: null })} className="btn btn-link my-2" type="button">Cancel</button>
        </div>
    return (
      <div>
        <header>
          <nav className="navbar navbar-light bg-light text-primary">
            <a className="navbar-brand text-primary" href="#changeThis">
              <img src={logo} alt="wateringCanIcon" height="36" />
              Water Your Subs
            </a>
            <h1>{`${new Date().toDateString()}`}</h1>
            <div className="d-flex dropdown">
              <img src={pfp} alt="user-pfp" height="36" />
              <a className="nav-link dropdown-toggle" href="#dashboard" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                {name}
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <li>
                  <a className="dropdown-item text-primary" href={href}>
                    Sign Out
                    <FontAwesomeIcon icon={faSignOutAlt} />
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </header>
        <main className="d-flex container">
          <section className="col-3">
            <NewSubscriptionsList updateDueDates={this.updateDueDates} />
          </section>
          <div className="col-8 offset-sm-1 border-start border-primary" >
            {loading 
              ? <div className="d-flex flex-column justify-content-center align-items-center fs-1">
                <FontAwesomeIcon icon={faSpinner} className="mb-2 spin" />
                Loading...
                </div> 
              : <div>
                {!addingSubscription && !editingSubscription
                  ? <DayPicker selectedDays={dueDates}  />
                  : subscriptionForm
                }
                </div>
            }
          </div>
        </main>
      </div>
    );
  };
};

export default Dashboard;