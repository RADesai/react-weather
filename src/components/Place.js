import React, { Component }  from 'react';
// import KEYS from './api.js';
// import places from 'places.js';
// import axios from 'axios';

class Place extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    console.log('props:', this.props);
  }

  render() {
    // App Styling
    // // Colors
    const orange = '#FF5733';
    // // Styles
    const homeStyle = {
      color: orange
    };
    // const barStyle = {
    //   border: `1px solid ${orange}`
    // };
    return (
      <div className="row" style={homeStyle}>
        <h2>{this.props.name}</h2>
      </div>
    );
  }
}

export default Place;
