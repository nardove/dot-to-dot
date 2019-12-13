import React, { Component, Fragment, createRef } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';


export default class FileLoaderPanel extends Component {
	constructor(props) {
		super(props);

		this.inputRef = createRef();
		this.handleFileLoader = this.handleFileLoader.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	handleFileLoader(event) {
		// Check for the various File API support.
		if (window.File && window.FileReader && window.FileList && window.Blob) {
			// console.log('Load files supported', event.target.files[0]);
			const loadedImage = event.target.files[0];
			const imgtag = document.getElementById('paper-img');
			imgtag.title = loadedImage.name;

			const reader = new FileReader();
			reader.onload = (event) => {
				imgtag.src = event.target.result;
				this.props.imageLoaded();
			};
			reader.readAsDataURL(loadedImage);
		} else {
			alert('The File APIs are not fully supported in this browser.');
		}
	}

	handleClose() {
		console.log('close file loader panel');
		this.props.handleClose();
	}

	render() {
		return (
			<div className='io-panel' onMouseLeave={this.handleClose}>
				{/* <Card style={{ width: '300px', position: 'fixed', left: '650px' }}> */}
				<Card>
					<CardActions>
						<input className='btn btn-light' type='file' id='files' ref={this.inputRef} onChange={this.handleFileLoader} />
					</CardActions>
				</Card>
			</div>
		);
	}
}
