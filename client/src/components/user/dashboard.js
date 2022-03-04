import React from 'react';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import NewSubscriptionsList from '../subscription/newSubscriptionsList';
import logo from '../../assets/watering-can.png';

const href = process && process.env && process.env.NODE_ENV === 'production'
  ? '/auth/logout'
  : 'http://localhost:5000/auth/logout';

// logo: https://www.flaticon.com/free-icon/watering-can_5268400?term=watering%20can&page=1&position=73&page=1&position=73&related_id=5268400&origin=tag
class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dueDates: [],
    };

    this.updateDueDates = this.updateDueDates.bind(this);
  };

  updateDueDates(dueDates) {
    this.setState({ dueDates });
  };

  render() {
    const { name, pfp } = this.props;
    const { dueDates } = this.state;
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
            <section>
              <DayPicker selectedDays={dueDates}  />
            </section>
          </div>
        </main>
      </div>
    );
  };
};

export default Dashboard;