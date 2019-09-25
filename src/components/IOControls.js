import React, {Component, createRef} from 'react';
import newIcon from '../assets/gui-icons/glyphicons-basic-37-file.svg';
import imgIcon from '../assets/gui-icons/glyphicons-basic-38-picture.svg';
import settingsIcon from '../assets/gui-icons/glyphicons-basic-138-cogwheels.svg';
import downloadIcon from '../assets/gui-icons/glyphicons-basic-199-save.svg';
import aboutIcon from '../assets/gui-icons/glyphicons-basic-636-circle-info.svg';
import FileLoader from './FileLoader';
import TweenLite from 'gsap/TweenLite';


export default class IOControls extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showFileLoader: false
		};
		this.toggleFileLoader = this.toggleFileLoader.bind(this);
		this.imageLoadComplete = this.imageLoadComplete.bind(this);
	}


	toggleFileLoader(event) {
		this.setState({showFileLoader: !this.state.showFileLoader}, () => {
			if (this.state.showFileLoader) {
				TweenLite.to('#fileloader-div', 0.3, {opacity:1});
			}
			else {
				TweenLite.to('#fileloader-div', 0.3, {opacity:0, onComplete:() => {
					console.log('file loader hide complete');
				}});
			}
		});
		// console.log(event, event.pageX, event.pageY);
	}

	imageLoadComplete() {
		// Hide image loader component after the image load is complete
		this.setState({showFileLoader: false});
		// Need to add the loaded image to paperjs raster
		console.log('image loaded');
		this.props.addImageToRaster();
	}


	render() {
		// const toogleDisplay = this.state.showFileLoader ? {} : {display: 'none'};

		return(
			<div className='io-controls container-fluid'>
				<div className='row justify-content-end'>
					<div className='col-auto'>
						<img className='img-btn' src={imgIcon} alt='Load photo' title='Load photo' onClick={this.toggleFileLoader} />
						{/* <img className='img-btn' src={newIcon}  alt='Create new' title='Create new' onClick={this.openFileLoader} /> */}
						<img className='img-btn' src={settingsIcon} alt='Image settings' title='Image settings' />
						<img className='img-btn' src={downloadIcon} alt='Download' title='Download' />
						<img className='img-btn' src={aboutIcon} alt='About' title='About' />
					</div>
				</div>
				{/* <div id='fileloader-div' className='row justify-content-end' > */}
				<div id='fileloader-div' className='row justify-content-end' style={{opacity:0}}>
					<div className='col-auto'>
						<FileLoader imageLoaded={this.imageLoadComplete} />
					</div>
				</div>
			</div>
		);
	}
}