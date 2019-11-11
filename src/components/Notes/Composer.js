import React, { Component } from 'react';
import './Composer.css';


const initialState = {
  title: {
    value: ''
  },
  description: {
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

    let state = initialState;
    if (props.note) {
      state = noteToState(props.note);
    }

    this.state = state;
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

    const newNote = {
      title,
      description
    }

    if (note) {
      newNote.id = note.id;
    }
    onSubmit(newNote);

    // reset
    this.setState(initialState);
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
        <form onSubmit={this.handleSubmit} className="input-form">
          <Input
            type="text"
            name="title"
            placeholder="Title"
            autoComplete={false}
            autoFocus
            value={this.getValue('title')}
            onChange={this.handleChange}
          />
          <Input
            name="description"
            placeholder="Write a note..."
            value={this.getValue('description')}
            onChange={this.handleChange}
          />

          <Button>Add Note</Button>
        </form>
      </div>
    );
  }
}

export default Composer;