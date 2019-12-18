import React, {
	Component
} from 'react';
import Tooltip from '@material-ui/core/Tooltip';
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
		// console.log('close adjustment panel');
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
			reader.onloadstart = () => {
				console.log('image loading starter');
			}
			reader.onprogress = (event) => {
				let percentLoaded = Math.round((event.loaded / event.total) * 100);
				console.log('image loading: ', percentLoaded);
			}
			reader.onloadend = () => {
				console.log('image loading completed');
			}
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
		return (
			<div className='io-controls' >
				<div className='io-controls-holder' >
					<Tooltip title='Load reference image' aria-label='Load reference image'>
						<IconButton>
							<input className='img-btn' type='file' accept='image/*' id='raised-button-file' onChange={this.handleFileLoader} />
							<label style={{ margin: '0px', padding: '0px', fontSize: '0em' }} htmlFor='raised-button-file'>
								<AddPhotoAlternateIcon />
							</label>
						</IconButton>
					</Tooltip>

					<Tooltip title='Reference image settings' aria-label='Reference image settings'>
						<IconButton onClick={this.toggleImageAdjustmentPanel}>
							<TuneIcon />
						</IconButton>
					</Tooltip>

					<Tooltip title='Download as PDF' aria-label='Download as PDF'>
						<IconButton onClick={this.exportDrawing}>
							<GetAppIcon />
						</IconButton>
					</Tooltip>

					<Tooltip title='Help' aria-label='Help'>
						<IconButton onClick={this.toggleAboutPanel}>
							<HelpIcon />
						</IconButton>
					</Tooltip>
				</div>

				{this.state.showImageAdjustmentPanel && <ImageAdjustmentPanel adjustImage={this.adjustImage} handleClose={this.toggleImageAdjustmentPanel} />}

				{this.state.showAboutPanel && <AboutPanel handleClose={this.toggleAboutPanel} />}
			</div>
		);
	}
}