import React, { Component } from "react";
import * as firebase from 'firebase/app';
import 'firebase/auth';


class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      url: "",
      progress: 0
    };
  }

  handleChange = e => {
    if (e.target.files) {
      if(e.target.files[0]){
        const image = e.target.files[0];
        this.setState(() => ({ image }));
      }
    }
  };

  // handleUpload = () => {
  //   const storage = firebase.storage();
  //   const { image } = this.state;
  //   const uploadTask = storage.ref(`images/${image.name}`).put(image);
  //   uploadTask.on(
  //     "state_changed",
  //     snapshot => {
  //       // progress function ...
  //       const progress = Math.round(
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //       );
  //       this.setState({ progress });
  //     },
  //     error => {
  //       // Error function ...
  //       console.log(error);
  //     },
  //     () => {
  //       // complete function ...
  //       storage
  //         .ref("images")
  //         .child(image.name)
  //         .getDownloadURL()
  //         .then(url => {
  //           this.setState({ url });
  //         });
  //     }
  //   );
  // };

  render() {
    return (
      <div className="center">
        <div className="file-field input-field">
          <div className="btn">
            <span>Upload image: </span>
            <input type="file" onChange={this.handleChange} />
          </div>
        </div>
        {/* <button
          onClick={this.handleUpload}
          className="waves-effect waves-light btn"
        >
          Upload
        </button> */}
      </div>
    );
  }
}

export default ImageUpload;
