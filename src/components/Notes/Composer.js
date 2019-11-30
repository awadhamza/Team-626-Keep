import React, { Component } from 'react';
import Modal from 'react-modal';
import './Composer.css';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import AddIcon from '@material-ui/icons/AddCircle'
import ImageUpload from '../Image/Image';
import CloseIcon from '@material-ui/icons/Close'
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

const initialState = {
  title: {
    value: ''
  },
  description: {
    value: ''
  },
  image: {
    value: ''
  }
};

const noteToState = note => {
  return {
    title: {
      value: note.title,
    },
    description: {
      value: note.description,
    },
    image: {
      value: note.image
    }
  };
}

const Button = ({ children, ...other }) => {
    return (
      <button {...other}>
        {children}
      </button>
    );
  };

  
const Input = ({ ...other }) => {
    return (
      <input {...other}/>
    );
};

  
class Composer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myUser: "",
      modalIsOpen: false,
      picture: null,
      uniqueLink: ""
    };
    let state = initialState;
    if (props.note) {
      state = noteToState(props.note);
    }

    this.state = state;

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
    this.setState({picture: null});
    this.setState({uniqueLink: ""});
  }

  componentDidMount() {
    var self = this
    firebase.auth().onAuthStateChanged(function(user){
      if (user) {
        self.setState({
          myUser: user.uid
        })
      }
      else {
        console.log('User is not logged-in')
      }
    })
  }

  handleChange = event => {
    const fieldName = event.target.name;

    this.setState({
      [fieldName]: {
        value: event.target.value
      },  
      
    });

    if (event.target.files) {
      if(event.target.files[0]){
        const picture = event.target.files[0];
        this.setState(() => ({ picture }));
      }
      
    }

  };


  handleSubmit = e => {
    e.preventDefault();
    console.log(this.state)
    const { onSubmit, note } = this.props;
    const title = this.state.title.value;
    const description = this.state.description.value.replace(/\n/g, '</br>');
    //var image = this.state.image.value;

    const newNote = {
      title,
      description,
      //image
    }

    if (note) {
      newNote.id = note.id;
    }
      

    // Append to real-time database
    var database = firebase.database();
    var dbRef = database.ref('notes/' + this.state.myUser + '/' + Date.now());
    dbRef.set({
         noteSubject: newNote.title,
         noteDesc: newNote.description,
         imageLink: '',
         noteTags: "[]",
         sharesWith: "[]",
         color: "#FFFFFF",
         isTrash: "False",
         isArchived: "False",
    });

    // Append to storage
    const storage = firebase.storage();
    var { picture } = this.state;

    if (picture != null) {
      console.log("picture is not null")
      var self = this;
      const uploadTask = storage.ref(`note_img/${picture.name}`).put(picture);
      uploadTask.on('state_changed',
      (snapshot) => {
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref('note_img')
          .child(picture.name)
          .getDownloadURL()
          .then(uniqueLink => {
            self.setState({uniqueLink});
            dbRef.update({
              imageLink: self.state.uniqueLink
            });

        })
      });
    }
    
    this.setState(initialState);
    this.closeModal();
  };

  getValue = fieldName => {
    return this.state[fieldName].value;
  };

  handleDelete = event => {
    event.preventDefault();
    this.props.onDelete && this.props.onDelete(this.props.note);
  }

  render() {
    const { isEdit } = this.props;

    return (
      <div className="composer-container">
      <div>
                <button onClick={this.openModal}>Add Note <AddIcon className="addIcon"/></button>
                <Modal
                  isOpen={this.state.modalIsOpen}
                  onAfterOpen={this.afterOpenModal}
                  onRequestClose={this.closeModal}
                  style={customStyles}
                  contentLabel="Add Note Modal"
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
                              autoFocus
                              value={this.getValue('title')}
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
                              value={this.getValue('description')}
                              onChange={this.handleChange}
                            />
                            <br></br>
                            <div className="center">
                            <div className="file-field input-field">
                              <div className="btn">
                                <span>Upload image: </span>
                                <Input 
                                type="file"
                                name="image"
                                //value={this.getValue('image')}
                                onChange={this.handleChange} />
                              </div>
                            </div>
                            </div>
                            <br></br>
                            
                            <Button>Done</Button>
                    </form>
                </Modal>
        </div>
      </div>
    );
  }
}

export default Composer;
