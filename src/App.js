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
    
    testFunction(x) {
        //var y = "signed in = " + x.toString();
        alert(x);
    }
    
    lockTabs() {
        var collection = document.getElementsByClassName('active_tabs');
        if(collection != null){
            /*alert("INITIAL COLL. LENGTH = " + collection.length);
            */
            for(var i = collection.length - 1; i >= 0; i--){
                //alert(i + " " + collection[i].className.toString());
                //alert(collection[i].textContent);
                collection[i].className = "disabled_tabs";
            }
            
            
            window.onload = function(){
                document.getElementById("1_act").innerHTML = "<i class=\"fas fa-lock\"></i> My Notes";
                document.getElementById("2_act").innerHTML = "<i class=\"fas fa-lock\"></i> Create Note";
                document.getElementById("3_act").innerHTML = "<i class=\"fas fa-lock\"></i> Archives ";
            }
            
            //        collection[2].className = "disabled_tabs";
            //        collection[1].className = "disabled_tabs";
            //        collection[0].className = "disabled_tabs";
        }
    }
    
    unlockTabs() {
        var collection = document.getElementsByClassName('disabled_tabs');
        if(collection != null){
            for(var i = collection.length - 1; i >= 0; i--){
                collection[i].className = "active_tabs";
            }
        }
        
        document.getElementById("1_act").innerHTML = "<i class=\"fas fa-sticky-note\"></i> My Notes";
        document.getElementById("2_act").innerHTML = "<i class=\"fas fa-plus-square\"></i> Create Note";
        document.getElementById("3_act").innerHTML = "<i class=\"fas fa-inbox\"></i> Archives ";
    }
    
    updateConnection(x) {
        if(x === 1) {
            //testFunction("signed in!");
            this.unlockTabs();
            signed_in = true;
        }
        else {
            this.lockTabs();
            signed_in = false;
        }
    }
    
    render() {
    const {
      user,
      signOut,
      signInWithGoogle,
    } = this.props;
  return (
    <div className="App">
      <header className="App-header">
        <div className="nav-bar">
            <img src={logo} className="App-logo" alt="logo" />
            {
                user
                ?
                 <React.Fragment>
                    <a class="active_tabs" id="1_act" href="#"><i class="fas fa-plus-square"></i> My Notes</a>
                    <a class="active_tabs" id="2_act" href="#"><i class="fas fa-plus-square"></i> Create Note</a>
                    <a class="active_tabs" id="3_act" href="#"><i class="fas fa-inbox"></i> Archives </a>
                 </React.Fragment>
                :
                 <React.Fragment>
                    <a class="disabled_tabs" id="1_act" href="#"><i class="fas fa-lock"></i> My Notes</a>
                    <a class="disabled_tabs" id="2_act" href="#"><i class="fas fa-lock"></i> Create Note</a>
                    <a class="disabled_tabs" id="3_act" href="#"><i class="fas fa-lock"></i> Archives </a>
                 </React.Fragment>
            }
        {/*
          user
            ? <p> ONLINE </p>
            : <p> OFFLINE </p>
        */}           
        </div>
        {
          user 
            ? 
              <React.Fragment>
                  {this.updateConnection(1)}    
                  <React.Fragment>
                    <img src={signed_in_img} className="sign-in-logo"/> 
                    <p>Hello, {user.displayName}</p>
                  </React.Fragment>
              </React.Fragment>
            : <React.Fragment>
                <img src={sign_in_img} onload={this.updateConnection(0)} className="sign-in-logo"/> 
                <p>Please sign in.</p>
                {this.updateConnection(0)}
              </React.Fragment>
        }
        {/*
          signed_in
            ? <p> ONLINE </p>
            : <p> OFFLINE </p>
        */}
        {
          user
            ? <button onClick={signOut}>Sign out</button>
            : <button onClick={signInWithGoogle}>Sign in with Google</button>
        }
        
        {/*
        <div> TEST BUTTONS </div>
        <button onClick={this.lockTabs}>LOCK TABS</button>
        <button onClick={this.unlockTabs}>UNLOCK TABS</button>
        */}
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
})(App);