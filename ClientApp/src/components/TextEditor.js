import React, { Component } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';




const TextEditor = ({ editorState, setEditorState, readOnly, fromCourseType = false }) => {
    const [_uploadedImages, setUploadedImages] = React.useState([]);

    const onEditorStateChange = (editorState) => {
        setEditorState(editorState)
    };

    const _uploadImageCallBack = React.useCallback((file) => {
        let uploadedImages = _uploadedImages;

        const imageObject = {
            file: file,
            localSrc: URL.createObjectURL(file),
        }

        uploadedImages.push(imageObject);

        setUploadedImages(uploadedImages)
        return new Promise(
            (resolve, reject) => {
                resolve({ data: { link: imageObject.localSrc } });
            }
        );
    })

    return (
        <div className="App">
            <header className="App-header">

                <Editor
                    placeholder='Description *'
                    editorState={editorState}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    editorStyle={{ lineHeight: "0.1" }}
                    onEditorStateChange={onEditorStateChange}
                    readOnly={readOnly}
                    toolbarHidden={readOnly || fromCourseType}
                    toolbar={{
                        inline: { inDropdown: true },
                        list: { inDropdown: true },
                        textAlign: { inDropdown: true },
                        link: { inDropdown: true },
                        history: { inDropdown: true },
                        image: { uploadCallback: _uploadImageCallBack },
                        inputAccept: 'application/pdf,text/plain,application/vnd.openxmlformatsofficedocument.wordprocessingml.document,application/msword,application/vnd.ms-excel'
                    }}
                />
            </header>
        </div>
    );

}


// class App extends Component {

//     constructor(props) {
//         super(props);
//         this.state = {
//             editorState: EditorState.createEmpty(),
//             uploadedImages: []
//         };
//         this._uploadImageCallBack = this._uploadImageCallBack.bind(this);
//     }

//     onEditorStateChange = (editorState) => {
//         this.setState({
//             editorState,
//         });
//     };


//     _uploadImageCallBack(file) {
//         // long story short, every time we upload an image, we
//         // need to save it to the state so we can get it's data
//         // later when we decide what to do with it.

//         // Make sure you have a uploadImages: [] as your default state
//         let uploadedImages = this.state.uploadedImages;

//         const imageObject = {
//             file: file,
//             localSrc: URL.createObjectURL(file),
//         }

//         uploadedImages.push(imageObject);

//         this.setState({ uploadedImages: uploadedImages })

//         // We need to return a promise with the image src
//         // the img src we will use here will be what's needed
//         // to preview it in the browser. This will be different than what
//         // we will see in the index.md file we generate.
//         return new Promise(
//             (resolve, reject) => {
//                 resolve({ data: { link: imageObject.localSrc } });
//             }
//         );
//     }
//     render() {
//         const { editorState } = this.state;
//         return (
//             <div className="App">
//                 <header className="App-header">

//                     <Editor
//                         editorState={editorState}
//                         toolbarClassName="toolbarClassName"
//                         wrapperClassName="wrapperClassName"
//                         editorClassName="editorClassName"
//                         onEditorStateChange={this.onEditorStateChange}
//                         toolbar={{
//                             inline: { inDropdown: true },
//                             list: { inDropdown: true },
//                             textAlign: { inDropdown: true },
//                             link: { inDropdown: true },
//                             history: { inDropdown: true },
//                             image: { uploadCallback: this._uploadImageCallBack },
//                             inputAccept: 'application/pdf,text/plain,application/vnd.openxmlformatsofficedocument.wordprocessingml.document,application/msword,application/vnd.ms-excel'
//                         }}
//                     />
//                 </header>
//             </div>
//         );
//     }
// }

export default TextEditor;