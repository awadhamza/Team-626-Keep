import React, { Component } from 'react';
import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app';
import 'firebase/auth';
import './HomePage.css';
import ResponsiveDrawer from '../Sidebar/Sidebar';
import Composer from '../Notes/Composer';
import Note from '../Notes/Note';
import SharedNotes from '../SharedNotes/SharedNotes';
import Trash from '../Trash/Trash';

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
        self.setState({
          myUser: user.displayName
        })
      }
      else {
        console.log('nope')
      }
    })
  }

  toggleNotes(){
     document.getElementsByClassName("Notes").style.display="block";
     document.getElementsByClassName("SharedNotes").style.display="none";
     document.getElementsByClassName("Trash").style.display="none";
  }

    render() {
  return (
    <div>
    
    <div className="Toolbar">
      <ResponsiveDrawer/>
      <div className="Title">
          Welcome, {this.state.myUser} !
      </div>
      <br/>  
      <div className="Notes">
        <Composer/>
        <Note/>
      </div>
      <div className="SharedNotes">
        <SharedNotes/>
      </div>
      <div className="Trash">
        <Trash/>
      </div>
    </div>
    </div>
  );
  }
}
export const toggleShared = (n) => {
  document.getElementsByClassName("Notes")[0].style.display="none";
  document.getElementsByClassName("SharedNotes")[0].style.display="block";
  document.getElementsByClassName("Trash")[0].style.display="none";
}

export const toggleNotes = (n) => {
  document.getElementsByClassName("Notes")[0].style.display="block";
  document.getElementsByClassName("SharedNotes")[0].style.display="none";
  document.getElementsByClassName("Trash")[0].style.display="none";
}

export const toggleTrash = (n) => {
  document.getElementsByClassName("Notes")[0].style.display="none";
  document.getElementsByClassName("SharedNotes")[0].style.display="none";
  document.getElementsByClassName("Trash")[0].style.display="block";
}
export default HomePage;