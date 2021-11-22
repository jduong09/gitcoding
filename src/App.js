import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.onGetData = this.onGetData.bind(this);
  }

  async onGetData() {
    try {
      const res = await fetch('/api');
      console.log('RES:', res);
      const data = await res.json();
      console.log('DATA: ', data);
    } catch (error) {
      console.log('ERROR: ', error, this.foo);
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit
            <code>src/App.js</code>
            and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <button type="button" onClick={this.onGetData}>
            Click Me
          </button>
        </header>
      </div>
    );
  }
}
export default App;
