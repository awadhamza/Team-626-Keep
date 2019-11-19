import React, { Component } from 'react';
import './SharedNotes.css';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import Masonry from 'react-masonry-css'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import ShareIcon from '@material-ui/icons/Share'
import { IconButton } from '@material-ui/core';
import Popup from "reactjs-popup";

var share_email;
let notes_pointers = [];

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
        var cleanEmail = user.email.replace('.','`');
        const sharedDB = firebase.database().ref('shared_notes/' + cleanEmail + '/');
        sharedDB.on('value', (snapshot) => {
          let listUID = snapshot.val();
          let detail = [];
          for (let UID in listUID) {
            let noteIDs = [];
            for(let note in listUID[UID]) {
              noteIDs.push(note);
            }
            notes_pointers.push({
                UID: UID,
                noteIDs: noteIDs
            });
            }
            for(let notePtr in notes_pointers){
              let noteIDs = notes_pointers[notePtr].noteIDs
              const notesDB = firebase.database().ref('notes/' + notes_pointers[notePtr].UID + '/');
              notesDB.on('value', (snapshot) => {
                let notes = snapshot.val();
                for (let note in notes) {
                  if(noteIDs.includes(note)){
                    detail.push({
                      date: note,
                      subject: notes[note].noteSubject,
                      description: notes[note].noteDesc
                    });
                  }
                }
              });
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
      <p>Filter by:</p>
      <Button onClick={this.filterRecent.bind(this)}>Most Recent</Button>
      <Button onClick={this.filterAlphabetical.bind(this)}>Alphabetical</Button>
      {this.state.notes.map((eachNote) => {
        //console.log(eachNote.date)
        return (
          <Masonry
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column">
          <div className="note-list-container">
            <div className="note-title">{eachNote.subject}</div>
            <div className="note-content">{eachNote.description}</div>
          </div>
          </Masonry>

        )
      })}
    </div>

    );
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
}

export default Note;