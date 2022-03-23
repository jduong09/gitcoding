import React from 'react';
import { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import SubscriptionsList from '../subscription/subscriptionsList';
import DashboardCalendar from '../date/dashboardCalendar';
import UpdateSubscription from '../subscription/updateSubscription';
import CreateSubscription from '../subscription/createSubscription';
import SubscriptionDetail from '../subscription/subscriptionDetail';
import logo from '../../assets/watering-can.png';

const href = process && process.env && process.env.NODE_ENV === 'production'
  ? '/auth/logout'
  : 'http://localhost:5000/auth/logout';

const todaysDate = new Date().toDateString();
const year = todaysDate.slice(todaysDate.length - 4);
const monthAndDay = todaysDate.slice(0, todaysDate.length - 5);
const concatenatedString = `${monthAndDay}, ${year}`;


// logo: https://www.flaticon.com/free-icon/watering-can_5268400?term=watering%20can&page=1&position=73&page=1&position=73&related_id=5268400&origin=tag
class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subscriptions: [],
      loading: false,
      addingSubscription: false,
      editingSubscription: null,
      activeSubscription: false,
    };

    this.setEditingSubscription = this.setEditingSubscription.bind(this);
    this.setAddingSubscription = this.setAddingSubscription.bind(this);
    this.setActiveSubscription = this.setActiveSubscription.bind(this);
    this.toggleLoadingState = this.toggleLoadingState.bind(this);
    this.showSubscriptionList = this.showSubscriptionList.bind(this);
  };
  
  async componentDidMount() {
    const data = await fetch(`${window.location.pathname}/subscriptions`);
    const { status } = data;

    if (status === 404) {
      window.location = '/not-found';
    }

    if (status === 400) {
      toast.error('Error: Error getting your subscriptions!');
      return;
    }
    const subscriptions = await data.json();

    for (let i = 0; i < subscriptions.length; i += 1) {
      const subscription = subscriptions[i];
      const { dueDate, name } = subscription;

      if (dueDate.lateDueDate) {
        toast.error(`Your ${name} subscription was due on ${new Date(dueDate.lateDueDate).toLocaleDateString()}`, {
          autoClose: false,
          style: { backgroundColor: 'red', color: '#000000' }
        });
      } else if (DateUtils.isSameDay(new Date(dueDate.nextDueDate), new Date()) && !dueDate.lateDueDate) {
        toast.info(`Your ${name} subscription is due today!`, {
          autoClose:false
        });
      }
    };

    this.setState({ subscriptions });
  };

  setEditingSubscription = async (editingSubscription) => {
    await this.setState({ editingSubscription });
  }

  setAddingSubscription = async (addingSubscription) => {
    await this.setState({ addingSubscription, activeSubscription: false });
  }

  setActiveSubscription = async (subscription) => {
    await this.setState({ activeSubscription: subscription });
  }

  handleUpdate = async (newSubscriptionsList) => {
    await this.setState({ subscriptions: newSubscriptionsList, activeSubscription: false });
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

    this.setState({ subscriptions: updatedSubscriptionsList, activeSubscription: false });
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

  
  renderMainComponent(subscriptionForm) {
    const { activeSubscription, addingSubscription, editingSubscription, loading, subscriptions } = this.state;

    if (loading) {
      return (
        <div className="col-12 d-flex flex-column justify-content-center align-items-center fs-1">
          <FontAwesomeIcon icon={faSpinner} className="mb-2 spin" />
          Loading...
        </div> 
      );
    }

    let display;
    if (activeSubscription) {
     display = <SubscriptionDetail setActiveSubscription={this.setActiveSubscription} setEditingSubscription={this.setEditingSubscription} handleDelete={this.handleDelete} details={activeSubscription} />;
    } else if (editingSubscription || addingSubscription) {
      display = (
        <div className="col-12">
          <div className="d-none d-md-block">
            {subscriptionForm}
          </div>
          <div className="d-md-none">
            <DashboardCalendar subscriptions={subscriptions}/>
          </div>
        </div>
      );
    } else {
      display = <DashboardCalendar subscriptions={subscriptions} />;
    }

    return display;
  }

  render() {
    const { pfp } = this.props;
    const { subscriptions, addingSubscription, editingSubscription } = this.state;

    const subscriptionForm = addingSubscription
      ? <div className="p-3 m-2 d-flex flex-wrap borderSubscriptionForm">
          <div className="col d-flex justify-content-between align-items-center">
            <div />
            <h2 className="text-start">Create Subscription</h2>
            <button className="btn btn-link my-2 d-md-none" type="button" data-bs-dismiss="offcanvas" aria-label="Close" onClick={() => this.setState({ addingSubscription: !addingSubscription })}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <button className="btn btn-link my-2 d-none d-md-block" type="button" onClick={() => this.setState({ addingSubscription: !addingSubscription })}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <CreateSubscription 
          addSubscription={this.handleUpdate}
          toggleLoadingState={this.toggleLoadingState}
          showSubscriptionList={this.showSubscriptionList}
          currentSubscriptions={subscriptions} />
        </div>
      : <div className="p-3 m-2 d-flex flex-wrap borderSubscriptionForm">
          <div className="col d-flex justify-content-between align-items-center">
            <div />
            <h2 className="text-start">Update Subscription</h2>
            <button className="btn btn-link my-2 d-md-none" type="button" data-bs-dismiss="offcanvas" aria-label="Close" onClick={() => this.setState({ editingSubscription: !editingSubscription, activeSubscription: false })} >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <button className="btn btn-link my-2 d-none d-md-block" type="button" onClick={() => this.setState({ editingSubscription: !editingSubscription, activeSubscription: false })}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <UpdateSubscription
          updateSubscription={this.handleUpdate}
          showSubscriptionList={this.showSubscriptionList}
          toggleLoadingState={this.toggleLoadingState}
          prevSubscription={editingSubscription}
          />
        </div>;
    return (
      <div className="h-100 d-flex flex-column">
        <header className="navbar py-2 px-4 d-flex justify-content-between align-items-center text-dark border-bottom shadow-sm">
          <a className="navbar-brand d-flex text-dark" href="#changeThis">
            <img src={logo} alt="wateringCanIcon" height="60" />
            <div className="align-self-center d-none d-md-block">Water Your Subs</div>
          </a>
          <h1 className="h3 fw-normal" id="nav-header">{concatenatedString}</h1>
          <div className="d-flex dropdown">
            <a className="" href="#dashboard" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <img className="border rounded-circle border-primary" src={pfp} alt="user-pfp" height="60" />
            </a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
              <li>
                <a className="dropdown-item d-flex align-items-center" href={href}>
                  <div className="p-2">Sign Out</div>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </a>
              </li>
            </ul>
          </div>
        </header>
        <main className="d-flex flex-fill flex-column flex-md-row justify-content-between">
          <div className="col-md-8 flex-fill h-100 d-flex align-items-center justify-content-center" id="mainContainer" >
            {this.renderMainComponent(subscriptionForm)}
          </div>
          <div className="col-md-4 p-3 order-md-first flex-fill">
            <SubscriptionsList
              subscriptions={subscriptions}
              setEditingSubscription={this.setEditingSubscription}
              setActiveSubscription={this.setActiveSubscription}
              handleDelete={this.handleDelete}
            />
            <div className="col mt-2">
              <div className="d-none d-sm-none d-md-block">
                <button
                  className="col-12 p-4 btn border-dashed border-primary btn-outline-primary"
                  type="button"
                  onClick={() => this.setAddingSubscription(true)}
                >
                  + Create
                </button>
              </div>
              <div className="d-md-none">
                <button
                  className="col-12 p-4 btn border-dashed border-primary btn-outline-primary"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasExample"
                  aria-controls="offcanvasExample"
                  onClick={() => this.setAddingSubscription(true)}
                >
                  + Create
                </button>
              </div>
            </div>
            <div className="offcanvas offcanvas-bottom d-md-none offcanvasBorder" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
              {addingSubscription || editingSubscription ? subscriptionForm : ''}
            </div>
          </div>
        </main>
      </div>
    );
  };
};

export default Dashboard;