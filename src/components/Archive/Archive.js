import React, { Component } from 'react';
import './Archive.css';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import Masonry from 'react-masonry-css'
import UnarchiveIcon from '@material-ui/icons/Unarchive'
import { IconButton } from '@material-ui/core';
import Popup from "reactjs-popup";

var tagSearch;

const Button = ({ children, ...other }) => {
    return (
      <button {...other}>
        {children}
      </button>
    );
  };

class Note extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: []
    };
  };

  componentDidMount() {
      var self = this
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          var userRef = firebase.database().ref('users/');
          const userDB = firebase.database().ref('notes/' + user.uid + '/');
          userDB.on('value', (snapshot) => {
            let notes = snapshot.val();

            let detail = [];

            for (let note in notes) {
              if(notes[note].isArchived == "True"){
                  detail.push({
                    date: note,
                    subject: notes[note].noteSubject,
                    description: notes[note].noteDesc,
                    tags: notes[note].noteTags,
                    color: notes[note].color,
                  });
              }
            }
            self.setState({
              notes: detail,
              myUser: user.uid
            })
          });
        }

        else {
          console.log('User is not logged-in')
        }
      });
  }

  render () {
    return (
    <div>
      <div>
        <p>Filter by:</p>
        <Button onClick={this.filterRecent.bind(this)}>Most Recent</Button>
        <Button onClick={this.filterAlphabetical.bind(this)}>Alphabetical</Button>
        <input
          placeholder='Search by tag'
          type='text'
          onChange={this.searchTagHandler.bind(this)}
        />
      </div>
      {this.state.notes.map((eachNote) => {
        return (
          <Masonry
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column">
          <div className="note-list-container">
            <div className="note-title">{eachNote.subject}</div>
            <div className="note-content">{eachNote.description}</div>
            <div className='note-footer'>
              <IconButton onClick={this.handleUnarchive.bind(this, eachNote.date)}>
                <UnarchiveIcon/>
              </IconButton>
            </div>
          </div>
          </Masonry>
        )
      })}
    </div>

    );
  }

  handleUnarchive(noteID) {
    var user = this.state.myUser;
    let userRef = firebase.database().ref('notes/' + user + '/');
    userRef.child(noteID).update({'isArchived': "False"});
  }

  filterRecent(){
        let temp = [];
        temp = this.state.notes;

        temp.sort(function(a, b){
            var keyA = a.date,
                keyB = b.date;
            // Compare the 2 dates
            if(keyA < keyB) return 1;
            if(keyA > keyB) return -1;
            return 0;
        });
        this.state.notes = temp;
        this.forceUpdate();
    }

    filterAlphabetical(){
        let temp = [];
        temp = this.state.notes;

        temp.sort(function(a, b){
            var keyA = a.subject,
                keyB = b.subject;
            // Compare the 2 dates
            if(keyA < keyB) return -1;
            if(keyA > keyB) return 1;
            return 0;
        });
        this.state.notes = temp;
        this.forceUpdate();
    }

    searchTagHandler = (event) => {
          tagSearch = event.target.value.toLowerCase();

          var detail = [];

          //Get list of all notes by this user
          var targetRef = firebase.database().ref('notes/' + this.state.myUser + '/').once('value', function(snapshot) {
              snapshot.forEach(function(childSnapshot) {
                  //alert("checking note#: " + childSnapshot.key);
                  var noteTags = childSnapshot.val().noteTags;

                  var sepTags = "";

                  if(noteTags.length > 2){
                    sepTags = noteTags.replace(/"/g, '').replace(/\[/g, '').replace(/\]/g, '');
                  }

                  var testArr = String(sepTags).split(',');

                  // For this note, check if there is a tag with substr of tagSearch
                  for(let tag in testArr){
                      if(testArr[tag].toLowerCase().includes(tagSearch)){
                            detail.push({
                              date: childSnapshot.key,
                              subject: childSnapshot.val().noteSubject,
                              description: childSnapshot.val().noteDesc,
                              tags: childSnapshot.val().noteTags,
                              color: childSnapshot.val().color,
                            });
                          break;
                      }
                  }
              });
            });

          this.state.notes = detail;
          this.forceUpdate();
      }
}

export default Note;