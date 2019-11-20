import React, { Component } from 'react';
import './Note.css';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import Masonry from 'react-masonry-css'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import ShareIcon from '@material-ui/icons/Share'
import AddTagIcon from '@material-ui/icons/AddCircleOutlined'
import DelTagIcon from '@material-ui/icons/RemoveCircleOutlined'
import { IconButton } from '@material-ui/core';
import Popup from "reactjs-popup";

var share_email;
var curr_tag;

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
              description: notes[note].noteDesc,
              tags: notes[note].noteTags,
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
      
    function outputTags(tags){
          let str = "Tags: ";
          //alert(tags.length);
          if(tags.length <= 2){
              return str + "N/A";
          }
          else {
            return "Tags: " + tags.replace(/"/g, '').replace(/\[/g, '').replace(/\]/g, '');
          }
      }
    function cutIndex(strTags){
          if(strTags.search(',') > 0){
              return strTags.indexOf(',');
          }
          return strTags.length;
      }
    function displayExistingTags(tags){
          
          var strTags = outputTags(tags);
          var tagButtons = [];
          
          while(strTags.length){
              
              let currCut = cutIndex(strTags);
              
              let nextName = strTags.substr(0, currCut);
              
              strTags = strTags.slice(currCut + 1, strTags.length);
              
              tagButtons.push(nextName);
              
          }
          //alert(document.getElementsByClassName("tagButtons"));
          //document.getElementsByClassName("tagButtons")[0].innerHTML = "<button>YES</button>";
          
          //========
          if(tags.length <= 2){
              return <p>No tags to delete</p>;
          }
            
          var retArr = [];
          for(let i = 0; i < tagButtons.length; i++){
              var txt = tagButtons[i];
              retArr.push(<button></button>);
              //alert(document.getElementById('tagButtons'));
          }
          return retArr;
          
          /*
          for(let i = 0; i < arrTest.length; i++){
              
              for(let j = 0; j < arrTest[i].length; j++){
                  //tagButtons.push(arrTest[i][j]);
                  
                  alert(arrTest[i][j]);
              }
              
          }*/
          
          
          
      }

    function textToHtml(html)
    {
        let arr = html.split("</br>");
        html = arr.reduce((el, a) => el.concat(a, <br />), []);
        return html;
    }
      
    return (
    <div>
      <div>
      <p>Filter by:</p>
      <Button onClick={this.filterRecent.bind(this)}>Most Recent</Button>
      <Button onClick={this.filterAlphabetical.bind(this)}>Alphabetical</Button>
      </div>
      {this.state.notes.map((eachNote) => {
        return (
          <Masonry
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column">
          <div className="note-list-container">
            <div className="note-title">{eachNote.subject}</div>
            <div className="note-content">{textToHtml(eachNote.description)}</div>
            <div className="note-tags">{outputTags(eachNote.tags)}</div>
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
              <Popup trigger={<IconButton><AddTagIcon/></IconButton>}>
                <form onSubmit={this.handleAddTag.bind(this, eachNote.date)} className="input-form">
                  <input
                    type='text'
                    onChange={this.tagChangeHandler}
                  />
                  <Button>Add Tag</Button>
                </form>
              </Popup>
              <Popup trigger={<IconButton><DelTagIcon/></IconButton>}>
                <form onSubmit={this.handleDeleteTag.bind(this, eachNote.date, eachNote.tags)} className="input-form">
                  <div id="tagButtons"></div>
                    {
                        //displayExistingTags(eachNote.tags)
                    }
                      <input
                        type='text' placeholder='Confirm tag name'
                        onChange={this.tagChangeHandler}
                      />
                      <Button>Remove</Button>
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
  
  handleDeleteTag(noteID, tag){
      //Get location of this note
      var userRef = firebase.database().ref('notes/' + this.state.myUser + '/' );
      
      firebase.database().ref('notes/' + this.state.myUser + '/' + noteID + '/').once('value').then(function(note) {
          var note_map = JSON.parse(JSON.stringify(note));
          var tagList = JSON.parse(note_map.noteTags);
          for( let i = 0; i < tagList.length; i++){ 
              //alert("is: " + tagList[i] + " == " + curr_tag + "?");
             if ( tagList[i] === curr_tag ) {
               tagList.splice(i, 1); 
                 
               break;
             }
          }
          tagList = JSON.stringify(tagList);
          userRef.child(noteID).update({'noteTags': tagList});
     });
  }

  tagChangeHandler = (event) => {
      curr_tag = event.target.value;
  }
  
  handleAddTag(noteID){
      //Get location of this note
      var userRef = firebase.database().ref('notes/' + this.state.myUser + '/' );
      
      firebase.database().ref('notes/' + this.state.myUser + '/' + noteID + '/').once('value').then(function(note) {
          var note_map = JSON.parse(JSON.stringify(note));
          var tagList = JSON.parse(note_map.noteTags);
          tagList.push(curr_tag);
          tagList = JSON.stringify(tagList);
          userRef.child(noteID).update({'noteTags': tagList});
     });
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