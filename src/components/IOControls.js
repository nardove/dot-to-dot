import React, { Component } from 'react';
import gsap from 'gsap';
import Tooltip from '@material-ui/core/Tooltip';
import ImageAdjustmentPanel from './ImageAdjustmentPanel';
import AboutPanel from './AboutPanel';
import IconButton from '@material-ui/core/IconButton';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import TuneIcon from '@material-ui/icons/Tune';
import GetAppIcon from '@material-ui/icons/GetApp';
import HelpIcon from '@material-ui/icons/Help';
import PreloaderLoop from './PreloaderLoop';


export default class IOControls extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showFileLoader: false,
			showImageAdjustmentPanel: false,
			showAboutPanel: false,
			isLoadingImage: false,
			isImageLoaded: false
		};
		this.preloaderAnimation = gsap.timeline();

		this.preloaderAnimation.to(this.preloader, {
			duration: 5,
			rotate: Math.PI,
			paused: true
		});

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

	toggleFileLoader() {
		this.setState({ showFileLoader: !this.state.showFileLoader });
	}

	toggleImageAdjustmentPanel() {
		this.setState({ showImageAdjustmentPanel: !this.state.showImageAdjustmentPanel });
	}

	toggleAboutPanel() {
		this.setState({ showAboutPanel: !this.state.showAboutPanel });
	}

	adjustImage(sliderObj) {
		this.props.adjustImageRaster(sliderObj);
	}

	exportDrawing() {
		this.props.exportDrawing();
	}


	handleFileLoader(event) {
		// Check for the various File API support.
		if (window.File && window.FileReader && window.FileList && window.Blob) {
			const loadedImage = event.target.files[0];
			const imgtag = document.getElementById('paper-img');
			imgtag.title = loadedImage.name;

			const reader = new FileReader();
			reader.onloadstart = () => {
				this.setState({
					isLoadingImage: true,
					isImageLoaded: false
				});
				this.preloaderAnimation.play();
			}
			reader.onprogress = (event) => {
				let percentLoaded = Math.round((event.loaded / event.total) * 100);
			}
			reader.onloadend = () => {
				this.setState({
					isLoadingImage: false,
					isImageLoaded: true
				});
			}
			reader.onload = (event) => {
				imgtag.src = event.target.result;
				// Need to add the loaded image to paperjs raster
				this.props.addImageToRaster();
			};
			reader.readAsDataURL(loadedImage);
		} else {
			alert('The File APIs are not fully supported in this browser.');
		}
	}


	render() {
		return (
			<div className='io-controls'>
				<div className='io-controls-holder'>
					{(this.state.isLoadingImage)
						?
						<IconButton disabled style={{ color: 'grey' }}>
							<PreloaderLoop style={{ position: 'relative', top: '10px' }} />
						</IconButton>
						:
						<Tooltip title='Load reference image' aria-label='Load reference image'>
							<IconButton>
								<input className='img-btn' type='file' accept='image/*' id='raised-button-file' onChange={this.handleFileLoader} />
								<label style={{ margin: '0px', padding: '0px', fontSize: '0em' }} htmlFor='raised-button-file'>
									<AddPhotoAlternateIcon />
								</label>
							</IconButton>
						</Tooltip>
					}

					{(this.state.isImageLoaded)
						?
						<Tooltip title='Reference image settings' aria-label='Reference image settings'>
							<IconButton onClick={this.toggleImageAdjustmentPanel}>
								<TuneIcon />
							</IconButton>
						</Tooltip>
						:
						<Tooltip title='Image settings - No image loaded' aria-label='Image settings - No image loaded'>
							<span>

								<IconButton disabled>
									<TuneIcon />
								</IconButton>
							</span>
						</Tooltip>
					}

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

				{this.state.showImageAdjustmentPanel && <ImageAdjustmentPanel
					handleClose={this.toggleImageAdjustmentPanel}
					adjustImage={this.adjustImage}
					imageOpacity={this.props.imageOpacity}
					imageScale={this.props.imageScale}
				/>}

				{this.state.showAboutPanel && <AboutPanel
					handleClose={this.toggleAboutPanel}
				/>}
			</div>
		);
	}
}