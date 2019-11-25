import React, { Component } from 'react';
import Modal from 'react-modal';
import './Note.css';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import Masonry from 'react-masonry-css'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import ShareIcon from '@material-ui/icons/Share'
import AddTagIcon from '@material-ui/icons/AddCircleOutlined'
import DelTagIcon from '@material-ui/icons/RemoveCircleOutlined'
import ArchiveIcon from '@material-ui/icons/Archive'
import EditIcon from '@material-ui/icons/Edit'
import ColorIcon from '@material-ui/icons/ColorLensOutlined';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close'
import Popup from "reactjs-popup";
import { BlockPicker, ChromePicker, CirclePicker, CompactPicker, GithubPicker, HuePicker, MaterialPicker, PhotoshopPicker, SketchPicker, SliderPicker, SwatchesPicker, TwitterPicker } from 'react-color';

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

Modal.setAppElement(document.getElementById('root'))

var share_email;
var curr_tag;
var my_User;
var myUserEmail;
var tagSearch;
var currHex = "#FFFFFF";
var noteCntr = 0;

const Input = ({ ...other }) => {
    return (
      <input {...other}/>
    );
};

const Button = ({ children, ...other }) => {
    return (
      <button {...other}>
        {children}
      </button>
    );
  };

var handleShare = function(noteID) {
        return function(event){
          event.preventDefault();
          var cleanEmail = share_email.replace('.','`');
          var userExists = false;
          const userDB = firebase.database().ref('users');
          userDB.on('value', (snapshot) => {
            let users = snapshot.val();
            for(var user in users){
              if(user == cleanEmail){
                userExists = true;
              }
            }
            if(share_email == myUserEmail){
              alert("You cannot share with yourself");
            }
            else if(!userExists){
              alert("That account does not exist");
            }
            else{
              let userRef = firebase.database().ref('notes/' + my_User + '/');
              firebase.database().ref('notes/' + my_User + '/' + noteID + '/').once('value').then(function(note) {
                var note_map = JSON.parse(JSON.stringify(note));
                var shareList = JSON.parse(note_map.sharesWith);
                shareList.push(cleanEmail);
                shareList = JSON.stringify(shareList);
                userRef.child(noteID).update({'sharesWith': shareList});
              });

              firebase.database().ref('shared_notes/' + cleanEmail + '/' + my_User + '/' + noteID).set({
                noteID: noteID
              });
              alert("Successfully shared with " + share_email);
            }
          });
        }
    };

class Note extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      myUser: '',
      modalIsOpen: false,
      note_title: '',
      note_description: '',
      note_ID: '',
      title: {value: ''},
      description: {value: ''},
    };
      
      noteCntr = 0;

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  };
    
  paintNotes() {
      var notesList = this.state.notes;
      var detail = [];

      for(let note in notesList){
          document.getElementsByClassName('note-title')[note].style["background-color"]=notesList[note].color;
          document.getElementsByClassName('note-content')[note].style["background-color"]=notesList[note].color;
          document.getElementsByClassName('note-tags')[note].style["background-color"]=notesList[note].color;
          
      } 
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  handleChange = event => {
     const fieldName = event.target.name;

      this.setState({
        [fieldName]: {
          value: event.target.value
        }
      });
    };

    handleSubmit = e => {
      e.preventDefault();
      const { onSubmit, note } = this.props;
      const title = this.state.title.value;
      const description = this.state.description.value.replace(/\n/g, '</br>');

      var userRef = firebase.database().ref('notes/' + this.state.myUser + '/' );
      userRef.child(this.state.note_ID).update({'noteSubject': title});
      userRef.child(this.state.note_ID).update({'noteDesc': description});

      this.closeModal();
    };

  componentDidUpdate() {
      this.paintNotes();
  }

  componentDidMount() {
    var self = this
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var cleanEmail = user.email.replace('.','`');
        var userRef = firebase.database().ref('users/');
        userRef.child(cleanEmail).update({'email': cleanEmail});
        const userDB = firebase.database().ref('notes/' + user.uid + '/');
        userDB.on('value', (snapshot) => {
          let notes = snapshot.val();

          let detail = [];
          for (let note in notes) {
            if(notes[note].isTrash == "False" && notes[note].isArchived == "False"){
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
          my_User = user.uid;
          myUserEmail = user.email;
        });
      }

      else {
        console.log('User is not logged-in')
      }
    });
    
    
  }

  handleEdit = (noteID, title, description) => {
      this.state.note_title = title;
      this.state.title.value = title;
      this.state.note_description = description.split('</br>').join('\n');
      this.state.description.value = description.split('</br>').join('\n');
      this.state.note_ID = noteID;
      this.openModal();
    };

  render () {
    function updateNoteCntr(){noteCntr = noteCntr+1;}
    function separateTags(tags){
          if(tags.length <= 2){
              return "";
          }
          else {
            return "Tags: " + tags.replace(/"/g, '').replace(/\[/g, '').replace(/\]/g, '');
          }
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
        
          if(tags.length <= 2){
              return <p>No tags to delete</p>;
          }
            
          var retArr = [];
          for(let i = 0; i < tagButtons.length; i++){
              var txt = tagButtons[i];
              retArr.push(<button></button>);
          }
          return retArr;
      }
    function textToHtml(html)
    {
        
        let arr = html.split("</br>");
        html = arr.reduce((el, a) => el.concat(a, <br />), []);

        return html;
    }
      
    return (
    <div>
      <div className="filtering-section">
      <p>Filter notes by:</p>
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
            <div className="note-content">{textToHtml(eachNote.description)}</div>
            <div className="note-tags">{outputTags(eachNote.tags)}</div>
            <div className='note-footer'>
              <Popup trigger={ open => (
                              <IconButton><ColorIcon/>{this.colorPopUp(open)}</IconButton>
                              )}>
                  <form onSubmit={this.handleColorChange.bind(this, eachNote.date)} className="input-form">
                    <CirclePicker onChange={e => this.changeColor(e.hex)} circleSpacing="11px" colors={["#e7baff", "#ffd1a6", "#a6ffbe", "#bdceff", "#ffb5be"]}>
                      </CirclePicker>
                  <Button className="color-button">Reset Color</Button>
                </form>
              </Popup>
              <IconButton onClick={this.handleDelete.bind(this, eachNote.date)}>
                <DeleteIcon/>
              </IconButton>
              <IconButton onClick={this.handleArchive.bind(this, eachNote.date)}>
                <ArchiveIcon/>
              </IconButton>
              <IconButton onClick={this.handleEdit.bind(this, eachNote.date, eachNote.subject, eachNote.description)}><EditIcon/></IconButton>
              <Popup trigger={<IconButton><ShareIcon/></IconButton>}>
                <form onSubmit={handleShare(eachNote.date)} className="input-form">
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
      <Modal
        isOpen={this.state.modalIsOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        style={customStyles}
        contentLabel="Edit Note Modal"
      >
        <button onClick={this.closeModal} className="close-button"><CloseIcon/></button>
          <br></br>
          <br></br>
          <form onSubmit={this.handleSubmit} className="input-form">
            <Input
            className="title"
            type="text"
            name="title"
            placeholder="Title"
            defaultValue={this.state.note_title}
            onChange={this.handleChange}
          />
          <br></br>
          <br></br>
          <textarea
            className="description"
            name="description"
            placeholder="Write a note..."
            cols="75"
            rows="6"
            defaultValue={this.state.note_description}
            onChange={this.handleChange}
          />
          <br></br>
          <br></br>
          <Button>Done</Button>
        </form>
      </Modal>
    </div>
      
    );
  }
  
  colorPopUp(open){
     if(open == false){
         currHex = "#FFFFFF";
     }
  }

  changeColor(someHex){
      currHex = someHex;
      if(currHex == "#FFFFFF"){
          document.getElementsByClassName('color-button')[0].innerHTML = "Reset Color";
      } else {
          document.getElementsByClassName('color-button')[0].innerHTML = "Update Color";
      }
  }

  handleColorChange(noteID) {
      //alert('Trying to change color of note#' + noteID + " to " + currHex);
       var userRef = firebase.database().ref('notes/' + this.state.myUser + '/');
       var targetref = firebase.database().ref('notes/' + this.state.myUser + '/' + noteID + '/').once('value', function(snapshot){
            //alert("Trying to change note with current color of: " + snapshot.val().color + ' to ' + currHex);
            userRef.child(noteID).update({'color': currHex});
       });
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
      
      //alert("RETURNED ARRAY: " + detail);
      
  }

  handleDeleteTag(noteID, tag){
      //Get location of this note
      var userRef = firebase.database().ref('notes/' + this.state.myUser + '/' );
      var deleted = false;
      firebase.database().ref('notes/' + this.state.myUser + '/' + noteID + '/').once('value').then(function(note) {
          var note_map = JSON.parse(JSON.stringify(note));
          var tagList = JSON.parse(note_map.noteTags);
          for( let i = 0; i < tagList.length; i++){ 
              //alert("is: " + tagList[i] + " == " + curr_tag + "?");
             if ( tagList[i] === curr_tag ) {
               tagList.splice(i, 1); 
               deleted = true;
               break;
             }
          }
          if(deleted){
            tagList = JSON.stringify(tagList);
            userRef.child(noteID).update({'noteTags': tagList});
          } else {
            alert("That tag does not exist");
          }
     });
  }

  tagChangeHandler = (event) => {
      curr_tag = event.target.value;
  }
  
  handleAddTag(noteID){
      //Get location of this note
      if(curr_tag == null){
          alert("Tag can't be empty!");
          return;
      }
      
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
    let userRef = firebase.database().ref('notes/' + user + '/');
    userRef.child(noteID).update({'isTrash': "True"});
  }

  handleArchive(noteID) {
    var user = this.state.myUser;
    let userRef = firebase.database().ref('notes/' + user + '/');
    userRef.child(noteID).update({'isArchived': "True"});
  }
}

export default Note;