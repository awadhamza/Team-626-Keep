import React, { Component } from 'react';
import './Note.css';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import Masonry from 'react-masonry-css'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import { IconButton } from '@material-ui/core';

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
          // let noteSub = []
          // let noteDesc = []
          // snapshot.forEach((child) => {
          //   noteSub.push(child.child('noteSubject').val())
          //   noteDesc.push(child.child('noteDesc').val())
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
            <div className='note-footer'>
              <IconButton onClick={this.handleDelete.bind(this, eachNote.date)}>
                <DeleteIcon/>
              </IconButton>
            </div>
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

  handleDelete(noteID) {
    //console.log('notes/' + this.state.myUser + '/' + noteID)
    firebase.database().ref('notes/' + this.state.myUser + '/' + noteID).remove();
  }

}

export default Note;