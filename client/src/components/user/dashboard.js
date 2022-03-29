import React from 'react';
import { Modal } from 'bootstrap';
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
import ModalComponent from '../modalComponent';
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
      activeSubscription: false,
      mainComponentView: 'dashboardCalendar',
      nextView: null,
      isDeleting: false
    };

    this.setAddingSubscription = this.setAddingSubscription.bind(this);
    this.setActiveSubscription = this.setActiveSubscription.bind(this);
    this.toggleLoadingState = this.toggleLoadingState.bind(this);
    this.showSubscriptionList = this.showSubscriptionList.bind(this);
    this.setMainComponentView = this.setMainComponentView.bind(this);
    this.handleDashboardChange = this.handleDashboardChange.bind(this);
    this.openDeleteModal = this.openDeleteModal.bind(this);
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
        });
      } else if (DateUtils.isSameDay(new Date(dueDate.nextDueDate), new Date()) && !dueDate.lateDueDate) {
        toast.info(`Your ${name} subscription is due today!`, {
          autoClose:false
        });
      }
    };

    this.setState({ subscriptions });
    this.viewModal = new Modal(document.getElementById('dashboardModal'));
  };

  handleDashboardChange(newView) {
    const { mainComponentView } = this.state;

    if (mainComponentView === 'dashboardCalendar' || mainComponentView === 'subscriptionDetail') {
      this.setState({ mainComponentView: newView });
      return;
    }

    this.setState({ nextView: newView, isDeleting: false });
    this.viewModal.show();
  }

  handleModalClick = (userInput) => {
    const { mainComponentView, nextView, activeSubscription } = this.state;
    if (nextView) {
      this.setState({ mainComponentView: userInput ? nextView : mainComponentView, nextView: null });
      this.viewModal.hide();
    } else {
      if (userInput) {
        this.handleDelete(activeSubscription.subscriptionUuid);
        this.setState({ mainComponentView: 'dashboardCalendar', activeSubscription: false });
      }
      this.viewModal.hide();
    }
  }

  setMainComponentView = (newView) => {
    this.setState({ mainComponentView: newView });
  };

  setAddingSubscription = async (addingSubscription) => {
    await this.setState({ addingSubscription, activeSubscription: false });
  }

  setActiveSubscription = async (subscription) => {
    await this.setState({ activeSubscription: subscription });
  }

  handleUpdate = async (newSubscriptionsList) => {
    await this.setState({ subscriptions: newSubscriptionsList, mainComponentView: 'dashboardCalendar' });
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
    
    const { subscriptions, activeSubscription } = this.state;
    const updatedSubscriptionsList = await subscriptions.filter(subscription => subscription.subscriptionUuid !== subscriptionUuid);

    const newState = (subscriptionUuid === activeSubscription.subscriptionUuid)
      ? { subscriptions: updatedSubscriptionsList, activeSubscription: false, mainComponentView: 'dashboardCalendar' }
      : { subscriptions: updatedSubscriptionsList };

    this.setState(newState);
  }

  openDeleteModal() {
    this.setState({ isDeleting: true });
    this.viewModal.show();
  }

  showSubscriptionList() {
    this.setState({ addingSubscription: false });
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

  renderMainComponent() {
    const { activeSubscription, loading, subscriptions, mainComponentView } = this.state;

    if (loading) {
      return (
        <div className="col-12 d-flex flex-column justify-content-center align-items-center fs-1">
          <FontAwesomeIcon icon={faSpinner} className="mb-2 spin" />
          Loading...
        </div> 
      );
    }

    switch (mainComponentView) {
      case 'subscriptionDetail':
        return (
          <SubscriptionDetail 
            setActiveSubscription={this.setActiveSubscription}
            handleDashboard={this.handleDashboardChange}
            handleDelete={this.handleDelete}
            details={activeSubscription} 
            openDeleteModal={this.openDeleteModal}
          />
        );
      case 'createSubscription':
        return (
          <div className="h-90 d-flex align-items-start">
            <div className="col-11 p-1 mx-auto flex-column d-none d-md-flex">
              <div className="d-flex mb-4 justify-content-between align-items-center">
                <h2 className="text-start">Create Subscription</h2>
                <button className="btn my-2 d-md-none" type="button" data-bs-dismiss="offcanvas" aria-label="Close" onClick={() => this.handleDashboardChange('dashboardCalendar')}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
                <button className="btn my-2 d-none d-md-block" type="button" onClick={() => this.handleDashboardChange('dashboardCalendar')}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <CreateSubscription
                addSubscription={this.handleUpdate}
                toggleLoadingState={this.toggleLoadingState}
                showSubscriptionList={this.showSubscriptionList}
                currentSubscriptions={subscriptions} />
            </div>
            <div className="d-md-none">
              <DashboardCalendar subscriptions={subscriptions} />
            </div>
          </div>
        );
      case 'updateSubscription': 
        return (
          <div className="h-90 d-flex align-items-start">
            <div className="col-11 p-1 mx-auto flex-column d-none d-md-flex">
              <div className="d-flex mb-4 justify-content-between align-items-center">
                <h2 className="text-start">Update Subscription</h2>
                <button className="btn my-2 d-md-none" type="button" data-bs-dismiss="offcanvas" aria-label="Close" onClick={() => this.handleDashboardChange('subscriptionDetail')} >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
                <button className="btn my-2 d-none d-md-block" type="button" onClick={() => this.handleDashboardChange('subscriptionDetail')}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <UpdateSubscription
                updateSubscription={this.handleUpdate}
                showSubscriptionList={this.showSubscriptionList}
                toggleLoadingState={this.toggleLoadingState}
                prevSubscription={activeSubscription}
              />
            </div>
            <div className="d-md-none">
              <DashboardCalendar subscriptions={subscriptions} />
            </div>
          </div>
        );
      default: 
        return (
          <div className="align-self-center">
            <DashboardCalendar subscriptions={subscriptions} />
          </div>
        );
    }
  }

  render() {
    const { pfp } = this.props;
    const { subscriptions, addingSubscription, activeSubscription, isDeleting } = this.state;
    const subscriptionForm = addingSubscription
      ? <div className="p-3 m-2 d-flex flex-wrap borderSubscriptionForm">
          <div className="col d-flex justify-content-between align-items-center">
            <h2 className="text-start">Create Subscription</h2>
            <button className="btn my-2 d-md-none" type="button" data-bs-dismiss="offcanvas" aria-label="Close" onClick={() => this.setState({ addingSubscription: !addingSubscription, mainComponentView: 'dashboardCalendar' })}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <button className="btn my-2 d-none d-md-block" type="button" onClick={() => this.setState({ addingSubscription: !addingSubscription, mainComponentView: 'dashboardCalendar' })}>
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
            <h2 className="text-start">Update Subscription</h2>
            <button className="btn my-2 d-md-none" type="button" data-bs-dismiss="offcanvas" aria-label="Close" onClick={() => this.setState({ activeSubscription: false, mainComponentView: 'dashboardCalendar' })} >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <button className="btn my-2 d-none d-md-block" type="button" onClick={() => this.setState({ activeSubscription: false, mainComponentView: 'dashboardCalendar' })}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <UpdateSubscription
          updateSubscription={this.handleUpdate}
          showSubscriptionList={this.showSubscriptionList}
          toggleLoadingState={this.toggleLoadingState}
          prevSubscription={activeSubscription}
          />
        </div>;
    return (
      <div className="h-100 d-flex flex-column">
        <header className="navbar py-2 px-4 d-flex justify-content-between align-items-center text-dark border-bottom shadow-sm">
          <a className="navbar-brand d-flex text-dark" href="#changeThis">
            <img src={logo} alt="wateringCanIcon" height="60" />
            <div className="align-self-center d-none d-md-block">Water Your Subs</div>
          </a>
          <h1 className="h3 fw-bolder text-primary" id="nav-header">{concatenatedString}</h1>
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
          <div className="col-md-8 flex-fill h-100 d-flex justify-content-center" id="mainContainer" >
            {this.renderMainComponent()}
          </div>
          <div className="col-md-4 p-3 order-md-first flex-fill border-end shadow-sm">
            <SubscriptionsList
              subscriptions={subscriptions}
              setActiveSubscription={this.setActiveSubscription}
              handleDashboard={this.handleDashboardChange}
              handleDelete={this.handleDelete}
              openDeleteModal={this.openDeleteModal}
            />
            <div className="col mt-2">
              <div className="d-none d-sm-none d-md-block">
                <button
                  className="col-12 p-4 btn border-dashed border-primary btn-outline-primary"
                  type="button"
                  onClick={() => this.handleDashboardChange('createSubscription')}
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
                  onClick={() => this.setState({ addingSubscription: true })}
                >
                  + Create
                </button>
              </div>
            </div>
            <div className="offcanvas offcanvas-bottom d-md-none overflow-auto offcanvasBorder" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
              {addingSubscription || activeSubscription ? subscriptionForm : ''}
            </div>
            <ModalComponent handleModalClick={this.handleModalClick} isDeleting={isDeleting} />
          </div>
        </main>
      </div>
    );
  };
};

export default Dashboard;