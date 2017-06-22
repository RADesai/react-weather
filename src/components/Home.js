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
const wind_color = '#ffd877';
// const cloud_color = '#3F51B5';
// // Styles
const homeStyle = {
  color: green,
  fontFamily: `'Overpass', sans-serif`
};
const detailStyle = {
  // border: `2px solid ${white}`,
  background: 'transparent'
};
const barStyle = {
  backgroundColor: '#fff'
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
      winds: [],
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
        winds: that.state.winds.concat([response.data.wind.speed]),
        clouds: that.state.clouds.concat([response.data.clouds.all])
      });
      // Create chart
      that.createChart();
    })
    .catch(function (error) {
      console.log(error)
    });
  }

  // Helper Functions

  // // Adding datasets to chart
  createDataset(dataLabel, dataset, bgColor) {
    return {
      label: dataLabel,
      data: dataset,
      backgroundColor: bgColor,
      borderColor: '#fff',
      hoverBorderColor: '#262933',
      borderWidth: 1,
    }
  }

  // // Display rounded temperature
  truncate(number) {
    return Math[number < 0 ? 'ceil' : 'floor'](number);
  };

  // // Create Chart
  createChart() {
    let ctx = document.getElementById("myChart").getContext("2d");
    if (this.state.chart) this.state.chart.destroy();

    // Global Options
    Chart.defaults.global.defaultFontFamily = 'Overpass';
    Chart.defaults.global.defaultFontColor = green;

    let myChart = new Chart(ctx, {
      type: 'horizontalBar',
      data: {
        labels: this.state.places,
        datasets: [
          this.createDataset('Temperature (F)', this.state.temps, temp_color),
          this.createDataset('Humidity (%)', this.state.humid, humid_color),
          this.createDataset('Wind (MPH)', this.state.winds, wind_color),
          this.createDataset('Cloudiness (%)', this.state.clouds, white)
        ]
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

  renderSearch() {
    return (
      <div className="jumbotron" style={detailStyle}>
        <div className="row">
          <div className="col-xs-12 col-md-8 col-md-offset-2 text-center">
            <h1>Where are we going?</h1>
            <hr style={barStyle} />
          </div>
          <div className="col-xs-12 col-md-8 col-md-offset-2">
            <input type="search" id="address-input" placeholder="Where are we going?" />
          </div>
        </div>
      </div>
    );
  }

  renderChart() {
    return (
      <div style={barStyle}>
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
        {this.renderChart()}
      </div>
    );
  }
}

export default Home;
