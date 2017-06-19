import React, { Component }  from 'react';
import './Home.css';
import KEYS from './api.js';
import places from 'places.js';
import Chart from 'chart.js';
import axios from 'axios';

// Components
// import Place from './Place';

// App Styling
// // Colors
const green = '#00695c';
const white = '#f1f4ff';
// Chart Groups
const temp_color = '#ee3017';
const humid_color= '#80CAED';
const cloud_color = '#3F51B5';
// // Styles
const homeStyle = {
  color: green,
  fontFamily: `'Overpass', sans-serif`
};
const detailStyle = {
  border: `2px solid ${white}`,
  background: '#fff'
};
const barStyle = {
  border: `1px solid ${green}`
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      sRise: null,
      sSet: null,
      lat: null,
      lng: null,
      places: [],
      temps: [],
      humid: [],
      clouds: [],
      colors: [],
      chart: null
    }
  }

  componentDidMount() {
    // Set up Algolia Places AutoCompleting Input
    let placesAutocomplete = places({
      container: document.querySelector('#address-input')
    });
    // On Location change, set state to new Location, look for weather
    placesAutocomplete.on('change', e => {
      this.setState({
        lat: e.suggestion.latlng.lat,
        lng: e.suggestion.latlng.lng
      });
      this.getWeather();
    }); // Within place change listener
  }

  getWeather() {
    // Use Openweather API to get weather for searched location
    // // Use KEYS.weatherAPI
    let that = this;
    axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${this.state.lat}&lon=${this.state.lng}&APPID=${KEYS.weatherAPI}&units=imperial`)
    .then(function (response) {
      console.log('Weather:', response.data);
      // Check for location already found, no duplicates
      that.setState({
        location: response.data,
        places: that.state.places.concat([response.data.name]),
        temps: that.state.temps.concat([response.data.main.temp]),
        humid: that.state.humid.concat([response.data.main.humidity]),
        clouds: that.state.clouds.concat([response.data.clouds.all]),
      })
    })
    .catch(function (error) {
      console.log(error)
    });

    // Create chart
    let ctx = document.getElementById("myChart").getContext("2d");
    if (this.state.chart) this.state.chart.destroy();

    // Global Options
    Chart.defaults.global.defaultFontFamily = 'Overpass';
    Chart.defaults.global.defaultFontColor = '#444';

    let myChart = new Chart(ctx, {
      type: 'horizontalBar',
      data: {
        labels: this.state.places,
        datasets: [{
          label: 'Temperature (F)',
          data: this.state.temps,
          backgroundColor: temp_color,
          borderColor: '#fff',
          hoverBorderColor: '#000',
          borderWidth: 1,
          pointBackgroundColor: '#fff',
          pointBorderColor: temp_color,
          pointHoverBackgroundColor: temp_color
        }, {
          label: 'Humidity (%)',
          data: this.state.humid,
          backgroundColor: humid_color,
          borderColor: '#fff',
          hoverBorderColor: '#000',
          borderWidth: 1,
          pointBackgroundColor: '#fff',
          pointBorderColor: humid_color,
          pointHoverBackgroundColor: humid_color
        }, {
          label: 'Cloudiness (%)',
          data: this.state.clouds,
          backgroundColor: white,
          borderColor: '#fff',
          hoverBorderColor: '#000',
          borderWidth: 1,
          pointBackgroundColor: '#fff',
          pointBorderColor: cloud_color,
          pointHoverBackgroundColor: cloud_color
        }]
      },
      options: {
        title: {
          display: true,
          text: 'Selected Locations',
          fontSize: 20
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            bottom: 20,
            top: 20
          }
        },
        scales: {
          xAxes: [{
            stacked: true,
            display: false
          }],
          yAxes: [{
            stacked: true
          }]
        }
      }
    });
    this.setState({
      chart: myChart
    });
  }

  // Helper Functions
  timeConverter(UNIX_timestamp){
    let a = new Date(UNIX_timestamp * 1000);
    // let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    // let year = a.getFullYear();
    // let month = months[a.getMonth()];
    // let date = a.getDate();
    let hour = a.getHours();
    if (hour.toString().length === 1) hour = `0${hour}`;
    let min = a.getMinutes();
    if (min.toString().length === 1) min = `0${min}`;
    let sec = a.getSeconds();
    if (sec.toString().length === 1) sec = `0${sec}`;
    // let fullDate = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    let time = hour + ':' + min + ':' + sec; // Only Time
    return time;
  }

  truncate(number) {
    return Math[number < 0 ? 'ceil' : 'floor'](number);
  };

  renderSearch() {
    return (
      <div className="row">
        <div className="col-xs-12 col-md-6 col-md-offset-3 text-center">
          <h1>Where are we going?</h1>
          <hr style={barStyle} />
        </div>
        <div className="col-xs-12 col-md-6 col-md-offset-3">
          <input type="search" id="address-input" placeholder="Where are we going?" />
        </div>
      </div>
    );
  }

  renderDetails() {
    return (
      <div style={detailStyle}>
        <div className="row">
          <div className="col-xs-12 col-md-6 col-md-offset-3 text-center">
            <h1><strong>{this.state.location.name}</strong></h1>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-4 text-center">
            <h4>{this.truncate(this.state.location.main.temp)}<span className="temp temp-far">&deg;F</span></h4>
            <h4>{this.truncate((this.state.location.main.temp - 32) / 1.8)}<span className="temp temp-cel">&deg;C</span></h4>
          </div>
          <div className="col-xs-4 text-center">
            <h4><em>Humidity: </em>{this.state.location.main.humidity}%</h4>
          </div>
          <div className="col-xs-4 text-center">
            <h4><em>Cloudiness: </em>{this.state.location.clouds.all}%</h4>
          </div>
        </div>
      </div>
    );
  }

  renderChart() {
    return (
      <div style={detailStyle}>
        <div className="row">
          <div className="col-xs-12 col-md-8 col-md-offset-2">
            <canvas id="myChart"></canvas>
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.location === null) {
      return (
        <div className="container" style={homeStyle}>
          {this.renderSearch()}
          <canvas id="myChart"></canvas>
        </div>
      );
    }
    return (
      <div className="container" style={homeStyle}>
        {this.renderSearch()}
        <br />
        {this.renderDetails()}
        <br />
        {this.renderChart()}
      </div>
    );
  }
}

export default Home;
