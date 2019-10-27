import React, { Component } from 'react';
import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';
import logo from './logo.svg';
import './App.css';
import sign_in_img from './sign-in-img.png';
import signed_in_img from './signed-in-img.png';

const firebaseApp = firebase.initializeApp(firebaseConfig);
var signed_in = false;

class App extends Component{
  render() {
    const {
      user,
      signOut,
      signInWithGoogle,
    } = this.props;
  return (
    <div className="App">
      <header className="App-header">
        <div className="nav-bar" onShow="lockTabs()">
            <img src={logo} className="App-logo" alt="logo" />
            <a id="nav_tabs" href="">My Notes</a>
            <a id="nav_tabs" href="">Create Note</a>
            <a id="nav_tabs" href="">Archives </a>
        </div>
        {
          user 
            ? 
              <React.Fragment>
                  <React.Fragment>
                    <img src={signed_in_img}className="sign-in-logo"/> 
                    <p onShow="updateConnection(1)">Hello, {user.displayName}</p>
                  </React.Fragment>
              </React.Fragment>
      
            : <React.Fragment>
                <img src={sign_in_img}className="sign-in-logo"/> 
                <p onShow="updateConnection(0)">Please sign in.</p>
              </React.Fragment>
        }
        {
          user
            ? <button onClick={signOut}>Sign out</button>
            : <button onClick={signInWithGoogle}>Sign in with Google</button>
        }
      </header>
    </div>
  );
}
}

function lockTabs() {
    alert(document.getElementById('[nav_tabs]'));
}

function updateConnection(x) {
    if(x == 1){
        return signed_in = true;
    }
    return signed_in = false;
}

const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App);