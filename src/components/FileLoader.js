import React, {Component, Fragment, createRef} from 'react';
import TweenLite from 'gsap/TweenLite';


export default class FileLoader extends Component {
	constructor(props) {
		super(props);

		this.inputRef = createRef();
		this.handleFileLoader = this.handleFileLoader.bind(this);
	}
	
	handleFileLoader(event) {
		// Check for the various File API support.
		if (window.File && window.FileReader && window.FileList && window.Blob) {
			// console.log('Load files supported', event.target.files[0]);
			var loadedImage = event.target.files[0];			
			var imgtag = document.getElementById("paper-img");
			imgtag.title = loadedImage.name;
			
			var reader = new FileReader();
			reader.onload = (event) => {
				imgtag.src = event.target.result;
				this.props.imageLoaded();
			};
			
			reader.readAsDataURL(loadedImage);
			
		} else {
			alert('The File APIs are not fully supported in this browser.');
		}
	}

	render() {
		
		return(
			<Fragment>
				{/* <div ref={this.inputRef}> */}
					<input className='btn btn-light' type='file' id='files' ref={this.inputRef} onChange={this.handleFileLoader} />
				{/* </div> */}
			</Fragment>
		);
	}
}
