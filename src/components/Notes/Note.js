import React, { Component } from 'react';
import './Note.css';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import Masonry from 'react-masonry-css'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import ShareIcon from '@material-ui/icons/Share'
import { IconButton } from '@material-ui/core';
import Popup from "reactjs-popup";

var share_email;

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
      notes: [],
      myUser: '',
    };
  };

  componentDidMount() {
    var self = this
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {

        const userDB = firebase.database().ref('notes/' + user.uid + '/');
        userDB.on('value', (snapshot) => {
          let notes = snapshot.val();

          let detail = [];

          for (let note in notes) {
            detail.push({
              date: note,
              subject: notes[note].noteSubject,
              description: notes[note].noteDesc
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
      <div>
      <p>Filter by:</p>
      <Button onClick={this.filterRecent.bind(this)}>Most Recent</Button>
      <Button onClick={this.filterAlphabetical.bind(this)}>Alphabetical</Button>
      </div>
      {this.state.notes.map((eachNote) => {
        //console.log(eachNote.date)
        return (
          <Masonry
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column">
          <div className="note-list-container">
            <div className="note-title">{eachNote.subject}</div>
            <div className="note-content">{eachNote.description}</div>
            <div className='note-footer'>
              <IconButton onClick={this.handleDelete.bind(this, eachNote.date)}>
                <DeleteIcon/>
              </IconButton>
              <Popup trigger={<IconButton><ShareIcon/></IconButton>}>
                <form onSubmit={this.handleShare.bind(this, eachNote.date)} className="input-form">
                  <input
                    type='text'
                    onChange={this.myChangeHandler}
                  />
                  <Button>Share</Button>
                </form>
              </Popup>
            </div>
          </div>
          </Masonry>

        )
      })}
    </div>
      
    );
  }

  myChangeHandler = (event) => {
        share_email = event.target.value;
  }

  handleShare(noteID){
    var cleanEmail = share_email.replace('.','`');
    let userRef = firebase.database().ref('notes/' + this.state.myUser + '/');
    firebase.database().ref('notes/' + this.state.myUser + '/' + noteID + '/').once('value').then(function(note) {
      var note_map = JSON.parse(JSON.stringify(note));
      var shareList = JSON.parse(note_map.sharesWith);
      shareList.push(cleanEmail);
      shareList = JSON.stringify(shareList);
      userRef.child(noteID).update({'sharesWith': shareList});
    });

    firebase.database().ref('shared_notes/' + cleanEmail + '/' + this.state.myUser + '/' + noteID).set({
      noteID: noteID
    });
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

  handleDelete(noteID) {
    var user = this.state.myUser;
    firebase.database().ref('notes/' + this.state.myUser + '/' + noteID + '/').once('value').then(function(note) {
      var note_map = JSON.parse(JSON.stringify(note));
      var shareList = JSON.parse(note_map.sharesWith);
      for(var note in shareList){
        firebase.database().ref('shared_notes/' + shareList[note] + '/' + user + '/' + noteID + '/').remove();
      }
    });
    firebase.database().ref('notes/' + user + '/' + noteID).remove();
  }

}

export default Note;