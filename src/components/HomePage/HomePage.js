import React, { Component } from 'react';
import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from '../../firebaseConfig';
import logo from '../../logo.svg';
import './HomePage.css';
import ResponsiveDrawer from '../Sidebar/Sidebar';
import GoogleButton from 'react-google-button'



class HomePage extends Component{
    render() {
  return (
    <div className="App">
      <ResponsiveDrawer/>
    </div>
  );
  }
}

export default HomePage;