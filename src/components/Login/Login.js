import React, { Component } from 'react';
import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from '../../firebaseConfig';
import ResponsiveDrawer from '../Sidebar/Sidebar';
import GoogleButton from 'react-google-button'

const firebaseApp = firebase.initializeApp(firebaseConfig);

class Login extends Component{
    render() {
    const {
      user,
      signOut,
      signInWithGoogle,
    } = this.props;
  return (

    <div className="App">
      <header className="App-header">
        {
          user
            ? <button onClick={signOut}>Sign out</button>
            : 
            <GoogleButton
            onClick={signInWithGoogle}
            />
        }
      </header>
    </div>
  );
}
}

const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(Login);