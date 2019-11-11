import React, { Component } from 'react';
import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from '../../firebaseConfig';
import logo from '../../logo.svg';
import './HomePage.css';
import ResponsiveDrawer from '../Sidebar/Sidebar';
import GoogleButton from 'react-google-button'
import NotesLayout from '../Notes/NotesLayout';

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
      <div className="Notes">
        <NotesLayout/>
        {this.state.myUser}
      </div>
    </div>
    </div>
  );
  }
}

export default HomePage;