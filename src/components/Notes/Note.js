import React, { Component } from 'react';
import './Note.css';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import Masonry from 'react-masonry-css'

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
      {this.state.notes.map((eachNote) => {
        return (
          <Masonry
          breakpointsCols={3}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column">
          <div>
            <div className="note-title">{eachNote.subject}</div>
            <div className="note-content">{eachNote.description}</div>
          </div>
          </Masonry>
        )
      })}
    </div>
      
    );
  }
}

export default Note;