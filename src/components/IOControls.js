import React, {
	Component,
	createRef
} from 'react';
import newIcon from '../assets/gui-icons/glyphicons-basic-37-file.svg';
import imgIcon from '../assets/gui-icons/glyphicons-basic-38-picture.svg';
import settingsIcon from '../assets/gui-icons/glyphicons-basic-138-cogwheels.svg';
import downloadIcon from '../assets/gui-icons/glyphicons-basic-199-save.svg';
import aboutIcon from '../assets/gui-icons/glyphicons-basic-636-circle-info.svg';
import TweenLite from 'gsap/TweenLite';
import FileLoaderPanel from './FileLoaderPanel';
import ImageAdjustmentPanel from './ImageAdjustmentPanel';

export default class IOControls extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showFileLoader: false,
			showImageAdjustmentPanel: false
		};

		this.toggleFileLoader = this.toggleFileLoader.bind(this);
		this.toggleImageAdjustmentPanel = this.toggleImageAdjustmentPanel.bind(this);

		this.imageLoadComplete = this.imageLoadComplete.bind(this);
		this.adjustImage = this.adjustImage.bind(this);

		this.fileLoaderRef = React.createRef();
		this.imageAdjustRef = React.createRef();
	}

	toggleFileLoader(event) {
		this.setState({
			showFileLoader: !this.state.showFileLoader
		},
			() => {
				this.togglePanel(this.state.showFileLoader, this.fileLoaderRef);
			}
		);
		// console.log(event, event.pageX, event.pageY);
	}

	toggleImageAdjustmentPanel(event) {
		this.setState({
			showImageAdjustmentPanel: !this.state.showImageAdjustmentPanel
		},
			() => {
				this.togglePanel(this.state.showImageAdjustmentPanel, this.imageAdjustRef);
			}
		);
	}

	togglePanel(state, ref) {
		state === true ?
			TweenLite.to(ref, 0.3, {
				opacity: 1,
				display: ''
			}) :
			TweenLite.to(ref, 0.1, {
				opacity: 0,
				display: 'none',
				onComplete: () => {
					console.log('image adjust panel hide complete');
				}
			});
	}

	imageLoadComplete() {
		// Hide image loader component after the image load is complete
		this.setState({
			showFileLoader: false
		});
		// Need to add the loaded image to paperjs raster
		console.log('image loaded');
		this.props.addImageToRaster();
	}

	adjustImage(sliderObj) {
		this.props.adjustImageRaster(sliderObj);
	}

	render() {
		// const toogleDisplay = this.state.showFileLoader ? {} : {display: 'none'};
		return (
			<div className='io-controls container-fluid' >
				<div className='row justify-content-end' >
					<div className='io-controls-holder col-auto' >
						<img className='img-btn'
							src={imgIcon}
							alt='Load photo'
							title='Load photo'
							onClick={
								this.toggleFileLoader
							} />
						{/* <img className='img-btn' src={newIcon}  alt='Create new' title='Create new' onClick={this.openFileLoader} /> */}
						<img className='img-btn'
							src={settingsIcon}
							alt='Image settings'
							title='Image settings'
							onClick={this.toggleImageAdjustmentPanel} />
						<img className='img-btn'
							src={downloadIcon}
							alt='Download'
							title='Download' />
						<img className='img-btn'
							src={aboutIcon}
							alt='About'
							title='About' />
					</div>
				</div>
				<div className='row justify-content-end' style={{ display: 'none' }} ref={(element) => (this.fileLoaderRef = element)} >
					<div className='file-loader-holder col-auto' onMouseLeave={this.toggleFileLoader} >
						<FileLoaderPanel imageLoaded={this.imageLoadComplete} />
					</div>
				</div>
				<div className='row justify-content-end' style={{ display: 'none' }} ref={(element) => (this.imageAdjustRef = element)} >
					<div className='file-loader-holder col-auto' onMouseLeave={this.toggleImageAdjustmentPanel} >
						<ImageAdjustmentPanel adjustImage={this.adjustImage} />
					</div>

				</div>
			</div>
		);
	}
}