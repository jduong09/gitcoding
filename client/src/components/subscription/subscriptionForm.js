import React from 'react';
import { toast } from 'react-toastify';
import ReactDayPicker from '../date/datepicker';
import '../../customDayPicker.scss';
import { convertStringToDate, convertDatesToWeekdays, convertWeekdaysToDates } from "../../utils/frontendDateUtils";

class SubscriptionForm extends React.Component {
  constructor(props) {
    super(props);

    const { method, prevSubscription } = props;
    let parseDate = prevSubscription?.dueDate?.dates || null;
    let updatedNickname;
    let weekDays = [];

    if (method === 'PATCH') {
      const { dueDate, nickname } = prevSubscription;
      parseDate = convertStringToDate(dueDate.dates);
      
      if (dueDate.frequency === 'weekly') {
        weekDays = convertDatesToWeekdays(parseDate);
      }

      updatedNickname = nickname || '';
    }

    this.state = {
      name: prevSubscription?.name || '',
      nickname: prevSubscription ? updatedNickname : '',
      reminderDays: prevSubscription?.reminderDays || 0,
      amount: prevSubscription ? prevSubscription.amount/100 : 0,
      frequency: prevSubscription?.dueDate?.frequency || '',
      occurrence: prevSubscription?.dueDate?.occurrence || 1,
      days: prevSubscription ? parseDate : [],
      checkedDays: prevSubscription ? weekDays : [],
      nextDueDate: prevSubscription?.dueDate?.nextDueDate || '',
      isUpdate: prevSubscription,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDays = this.handleDays.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }

  handleChange(event, key) {
    const { value } = event.target;
    event.preventDefault();

    if (key === 'frequency') {
      if (value === 'yearly') {
        return this.setState({ [key]: value, days: [], occurrence: 1 });
      }
      return this.setState({ [key]: value, days: [] });
    }

    return this.setState({ [key]: value });
  }

  handleCheck(event) {
    const { checkedDays } = this.state;
    const { checked, value } = event.target;
    let updatedList = checkedDays;
    if (checked) {
      updatedList = [...checkedDays, parseInt(value, 10)];
    } else {
      updatedList.splice(checkedDays.indexOf(parseInt(value, 10)), 1);
    }

    const datesList = convertWeekdaysToDates(updatedList);
    
    this.setState({ days: datesList, checkedDays: updatedList });
  }

  async handleSubmit(event) {
    const { method, handleSubscriptions, showSubscriptionList, toggleLoadingState, closeOffcanvas } = this.props;
    const { name, nickname, reminderDays, amount, frequency, occurrence, days }  = this.state;
    event.preventDefault();

    if (days.length === 0) {
      toast.error('Failed to Submit: Dates not selected for reminder.');
      return;
    }

    toggleLoadingState();

    const dates = this.parseDueDate();
    const dueDate = { frequency, occurrence, dates };

    const subscriptionInfo = { name, nickname, reminderDays, amount, dueDate };

    if (method === 'PATCH') {
      const { prevSubscription } = this.props;
      subscriptionInfo.subscriptionUuid = prevSubscription.subscriptionUuid;
    }
    
    const subscription = await fetch(`${window.location.pathname}/subscriptions`, {
      method,
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(subscriptionInfo)
    });

    const { status } = subscription;
    const response = await subscription.json();

    if (status === 400) {
      const { errorMessage } = response;
      toast.error(errorMessage);
      showSubscriptionList();
      return;
    }

    await handleSubscriptions(response);

    if (event.nativeEvent.submitter.ariaLabel === 'closeMobile') {
      closeOffcanvas();
    }


    toggleLoadingState();
    showSubscriptionList();
  }

  handleDays(days) {
    this.setState({ days });
  }

  parseDueDate() {
    const { days } = this.state;
    return days.map((day) => day.toISOString());
  }

  renderSwitch(frequency) {
    const { days, nextDueDate, checkedDays, isUpdate } = this.state;
    const weeklyCheckbox = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => 
      <label className="d-flex flex-column" htmlFor={day} key={day}>
        <div className="mx-auto col-md-3 form-check-label">{day}</div>
        <input className="mx-auto col-md-1 form-check-input" type="checkbox" id={day} name='days' value={idx} onChange={this.handleCheck} checked={checkedDays.includes(idx)}/>
      </label>
    );

    switch (frequency) {
      case 'yearly':
        return (
          <div className="col-12 p-3 d-flex flex-column">
            <div className="text-center d-none d-md-block">On which day do you want to be reminded?</div>
            <div className="col-12 col-md-6 dayPickerBorder">
              <div className="text-center" id="dayPickerForm">
                <ReactDayPicker handleUpdate={this.handleDays} updating={days} nextDueDate={nextDueDate} frequency='yearly' isUpdate={isUpdate} />
              </div>
            </div>
          </div>
        );
      case 'monthly':
        return (
          <div className="col-12 d-flex flex-column">
            <div className="text-center d-none d-md-block">On which day(s) do you want to be reminded?</div>
            <div className="col-12 col-md-6 dayPickerBorder">
              <div className="text-center" id="dayPickerForm">
                <ReactDayPicker handleUpdate={this.handleDays} updating={days} nextDueDate={nextDueDate} frequency='monthly' isUpdate={isUpdate} />
              </div>
            </div>
          </div>
        );
      case 'weekly':
        return (
          <div className="col-12">
            <div className="col-12 d-flex justify-content-around" >{weeklyCheckbox}</div>
            <div className="col-12 col-md-6 dayPickerBorder">
              <div className="col mx-auto text-center" id="dayPickerForm">
                <ReactDayPicker updating={days} nextDueDate={nextDueDate} frequency='weekly' isUpdate={isUpdate} />
              </div>
            </div>
          </div>
        );
      case 'daily':
        return (
          <div className="col-12 d-flex flex-column">
            <div className="text-center d-none d-md-block">On which day do you want to be reminded?</div>
            <div className="col-12 col-md-6 dayPickerBorder">
              <div className="text-center" id="dayPickerForm">
                <ReactDayPicker handleUpdate={this.handleDays} updating={days} frequency='daily' isUpdate={isUpdate} />
              </div>
            </div>
          </div>
        );
      default:
        return ('');
    }
  }

  render() {
    const { name, nickname, reminderDays, amount, frequency, occurrence } = this.state;

    return (
      <section className="col-12 d-flex flex-column">
        <form className="text-start d-md-flex flex-wrap" onSubmit={this.handleSubmit}>
          <label className="col-12 d-flex flex-column flex-md-row form-label align-items-center col-md-6" htmlFor="subscription-name">
            <div className="col-12 col-md-3 fw-bolder">Name</div>
            <div className="col-12 align-self-start col-md-7">
              <input className="form-control" id="subscription-name" type="text" placeholder="e.g. Crunchyroll" name="subscription-name" value={name} onChange={(event) => this.handleChange(event, 'name')} required />
            </div>
          </label>

          <label className="col-12 d-flex flex-column flex-md-row form-label align-items-center col-md-6" htmlFor="subscription-nickname">
            <div className="col-12 col-md-3 fw-bolder">Nickname</div>
            <div className="col-12 align-self-start col-md-7">
              <input className="form-control" type="text" id="subscription-nickname" placeholder="e.g. My favorite streaming site"name="subscription-nickname" value={nickname} onChange={(event) => this.handleChange(event, 'nickname')}  /> 
            </div>
          </label>

          <label className="col-12 d-flex flex-column flex-md-row form-label align-items-center col-md-6" htmlFor="subscription-reminder-days">
            <div className="col-12 col-md-3 fw-bolder">Alert</div>
            <div className="col-12 align-self-start col-md-7">
              <input className="form-control" type="number" id="subscription-reminder-days" name="subscription-reminder-days" min="0" value={reminderDays} onChange={(event) => this.handleChange(event, 'reminderDays')} required />
            </div>
          </label>

          <label className="col-12 d-flex flex-column flex-md-row form-label align-items-center col-md-6" htmlFor="subscription-amount">
            <div className="col-12 col-md-3 fw-bolder">Amount</div>
            <div className="col-12 align-self-start col-md-7">
              <input className="form-control" type="number" id="subscription-amount" name="subscription-amount" min="0" step="0.01" value={amount} onChange={(event) => this.handleChange(event, 'amount')} required />
            </div>
          </label>

          <label className="col-12 d-flex flex-column flex-md-row form-label align-items-center col-md-6" htmlFor="due-date-select">
            <div className="col-12 col-md-3 fw-bolder">Repeat</div>
            <div className="col-12 align-self-start col-md-7">
              <select className="form-select" id="due-date-select" value={frequency} onChange={(event) => this.handleChange(event, 'frequency')} required >
                <option value="" defaultValue disabled>--Select--</option>
                <option value="yearly">Yearly</option>
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </select>  
            </div>
          </label>

          {/* lol lemme know what you think of these conditionals */}
          {frequency && frequency !== 'yearly' &&
            <label className="col-12 d-flex flex-column flex-md-row form-label align-items-center col-md-6" htmlFor="occurrence">
              <div className="col-12 col-md-3 fw-bolder">
                {frequency !== 'daily'
                  ? `Every (?) ${frequency.charAt(0).toUpperCase()}${frequency.substring(1, frequency.length - 2)}s`
                  : 'Every (?) Days'
                }
              </div>
              <div className="col-12 align-self-start col-md-7">
                <input className="form-control" type="number" id="occurrence" value={occurrence} onChange={(event) => this.handleChange(event, 'occurrence')} min="0" max="12" />
              </div>
            </label>
          }

          {this.renderSwitch(frequency)}

          <div className="col-12 form-label text-center">
            <input className="btn btn-primary form-control d-none d-sm-none d-md-block" type="submit" id="input-submit-desktop" aria-label="closeDesktop" value="Submit" />
            <input className="btn btn-primary form-control-sm d-md-none" type="submit" id="input-submit-mobile" aria-label="closeMobile" value="Submit" />
          </div>
        </form>
      </section>
    );
  }
};

export default SubscriptionForm;