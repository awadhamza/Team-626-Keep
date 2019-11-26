import React, { Component } from 'react';
import Modal from 'react-modal';
import './Archive.css';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import Masonry from 'react-masonry-css'
import UnarchiveIcon from '@material-ui/icons/Unarchive'
import CloseIcon from '@material-ui/icons/Close'
import { IconButton } from '@material-ui/core';
import Popup from "reactjs-popup";

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    width                 : '50%',
    height                 : '50%',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

var tagSearch;

const Button = ({ children, ...other }) => {
    return (
      <button {...other}>
        {children}
      </button>
    );
  };

class Archive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      modalIsOpen: false,
      expandModalIsOpen: false,
      note_title: '',
      note_description: '',
      tags: '',
      note_ID: '',
    };

    this.openExpandModal = this.openExpandModal.bind(this);
    this.closeExpandModal = this.closeExpandModal.bind(this);
  };

  openExpandModal() {
    this.setState({expandModalIsOpen: true});
  }

  closeExpandModal() {
    this.setState({expandModalIsOpen: false});
  }

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

  handleExpandNote = (noteID, title, description, tags) => {
    this.state.note_title = title;
    this.state.note_description = description;
    this.state.note_ID = noteID;
    this.state.tags = tags;
    this.openExpandModal();
  }

  render () {
    function textToHtml(html)
    {
        let arr = html.split("</br>");
        html = arr.reduce((el, a) => el.concat(a, <br />), []);
        return html;
    }
    function outputTags(tags){
          let str = "Tags: ";
          if(tags.length <= 2){
              return "";
          }
          else {
            return "Tags: " + tags.replace(/"/g, '').replace(/\[/g, '').replace(/\]/g, '').replace(/,/g, ', ');
          }
    }
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
            <div style={{cursor:'pointer'}} onClick={this.handleExpandNote.bind(this, eachNote.date, eachNote.subject, eachNote.description, eachNote.tags)}>
              <div className="note-title">{eachNote.subject}</div>
              <div className="note-content">{textToHtml(eachNote.description)}</div>
            </div>
            <div className='note-footer'>
              <IconButton onClick={this.handleUnarchive.bind(this, eachNote.date)}>
                <UnarchiveIcon/>
              </IconButton>
            </div>
          </div>
          </Masonry>
        )
      })}
      <Modal
        isOpen={this.state.expandModalIsOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeExpandModal}
        style={customStyles}
        contentLabel="View Note Modal"
      >
        <button onClick={this.closeExpandModal} className="close-button"><CloseIcon/></button>
          <br></br>
          <br></br>
          <h1 style={{'text-align':'center', 'margin-top':'-10px', 'width':'100%'}}>{this.state.note_title}</h1>
          <br></br>
          <br></br>
          <div style={{'margin-top': '-45px', 'height': '50%', 'overflow-y':'auto'}}>{textToHtml(this.state.note_description)}</div>
          <div className="note-modal-tags">{outputTags(this.state.tags)}</div>
          <div className='modal-note-footer'>
              <IconButton onClick={this.handleUnarchive.bind(this, this.state.note_ID)}>
                <UnarchiveIcon/>
              </IconButton>
          </div>
      </Modal>
    </div>

    );
  }

  handleUnarchive(noteID) {
    var user = this.state.myUser;
    let userRef = firebase.database().ref('notes/' + user + '/');
    userRef.child(noteID).update({'isArchived': "False"});
    this.closeExpandModal();
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

export default Archive;