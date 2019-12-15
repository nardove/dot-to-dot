import React, {
	Component,
	createRef
} from 'react';
import newIcon from '../assets/gui-icons/glyphicons-basic-37-file.svg';
import imgIcon from '../assets/gui-icons/glyphicons-basic-38-picture.svg';
import settingsIcon from '../assets/gui-icons/glyphicons-basic-138-cogwheels.svg';
import downloadIcon from '../assets/gui-icons/glyphicons-basic-199-save.svg';
import aboutIcon from '../assets/gui-icons/glyphicons-basic-636-circle-info.svg';
// import FileLoaderPanel from './FileLoaderPanel';
import ImageAdjustmentPanel from './ImageAdjustmentPanel';
import AboutPanel from './AboutPanel';
import IconButton from '@material-ui/core/IconButton';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import TuneIcon from '@material-ui/icons/Tune';
import GetAppIcon from '@material-ui/icons/GetApp';
import HelpIcon from '@material-ui/icons/Help';




export default class IOControls extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showFileLoader: false,
			showImageAdjustmentPanel: false,
			showAboutPanel: false
		};

		this.toggleFileLoader = this.toggleFileLoader.bind(this);
		this.toggleImageAdjustmentPanel = this.toggleImageAdjustmentPanel.bind(this);
		this.toggleAboutPanel = this.toggleAboutPanel.bind(this);
		this.handleFileLoader = this.handleFileLoader.bind(this);

		this.adjustImage = this.adjustImage.bind(this);
		this.exportDrawing = this.exportDrawing.bind(this);

		this.fileLoaderRef = React.createRef();
		this.imageAdjustRef = React.createRef();
		this.aboutRef = React.createRef();
	}

	toggleFileLoader(event) {
		this.setState({ showFileLoader: !this.state.showFileLoader });
	}

	toggleImageAdjustmentPanel(event) {
		console.log('close adjustment panel');
		this.setState({ showImageAdjustmentPanel: !this.state.showImageAdjustmentPanel });
	}

	toggleAboutPanel(event) {
		this.setState({ showAboutPanel: !this.state.showAboutPanel });
	}

	adjustImage(sliderObj) {
		// console.log(sliderObj);
		this.props.adjustImageRaster(sliderObj);
	}

	exportDrawing() {
		this.props.exportDrawing();
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
				// Need to add the loaded image to paperjs raster
				console.log('image loaded');
				this.props.addImageToRaster();
			};
			reader.readAsDataURL(loadedImage);
		} else {
			alert('The File APIs are not fully supported in this browser.');
		}
	}


	render() {
		// const toogleDisplay = this.state.showFileLoader ? {} : {display: 'none'};
		return (
			<div className='io-controls' >
				<div className='io-controls-holder' >
					<IconButton>
						<input className='img-btn' type='file' accept='image/*' id='raised-button-file' onChange={this.handleFileLoader} />
						<label style={{ margin: '0px', padding: '0px', fontSize: '0em' }} htmlFor='raised-button-file'>
							<AddPhotoAlternateIcon />
						</label>
					</IconButton>
					<IconButton onClick={this.toggleImageAdjustmentPanel}>
						<TuneIcon />
					</IconButton>
					<IconButton onClick={this.exportDrawing}>
						<GetAppIcon />
					</IconButton>
					<IconButton onClick={this.toggleAboutPanel}>
						<HelpIcon />
					</IconButton>
				</div>
				{/* <div className='panel'> */}
				{this.state.showImageAdjustmentPanel && <ImageAdjustmentPanel adjustImage={this.adjustImage} handleClose={this.toggleImageAdjustmentPanel} />}

				{this.state.showAboutPanel && <AboutPanel handleClose={this.toggleAboutPanel} />}
				{/* </div> */}
			</div>
		);
	}
}