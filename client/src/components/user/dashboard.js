import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import SubscriptionsList from '../subscription/subscriptionsList';
import logo from '../../assets/watering-can.png';

const href = process && process.env && process.env.NODE_ENV === 'production'
  ? '/auth/logout'
  : 'http://localhost:5000/auth/logout';

// logo: https://www.flaticon.com/free-icon/watering-can_5268400?term=watering%20can&page=1&position=73&page=1&position=73&related_id=5268400&origin=tag
class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      successMessage: '',
    };
  }

  render() {
    const { successMessage } = this.state;
    const { name, pfp } = this.props;
    return (
      <div>
        <header>
          <nav className="navbar navbar-light bg-light">
            <div className="d-flex">
              <img src={logo} alt="wateringCanIcon" height="36" />
              <h2>Water Your Subs</h2>
            </div>
            <h1>{`${new Date().toDateString()}`}</h1>
            <div>
              <img src={pfp} alt="user-pfp" height="36" />
              {name}
            </div>
          </nav>
        </header>
        <section className="subscription-list">
          <SubscriptionsList />
        </section>
        {successMessage}
        <a href={href}>
          Sign Out!
          <FontAwesomeIcon icon={faSignOutAlt} />
        </a>
      </div>
    );
  }
};

export default Dashboard;