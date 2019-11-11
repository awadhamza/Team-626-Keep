import React, { Component } from 'react';
import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app';
import 'firebase/auth';
import './HomePage.css';
import ResponsiveDrawer from '../Sidebar/Sidebar';
import Composer from '../Notes/Composer';

class HomePage extends Component{
  constructor(props){
    super(props)
    this.state = {
      myUser: ""
    }
  }

  componentDidMount() {
    var self = this
    firebase.auth().onAuthStateChanged(function(user){
      if (user) {
        console.log(user)
        self.setState({
          myUser: user.displayName
        })
      }
      else {
        console.log('nope')
      }
    })
  }


    render() {
  return (
    <div>
    
    <div className="Toolbar">
      <ResponsiveDrawer/>
      <div className="Title">
          Welcome, {this.state.myUser} !
      </div>
      <Composer/>
    </div>
    </div>
  );
  }
}

export default HomePage;