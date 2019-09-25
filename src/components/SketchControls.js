import React, {Component} from 'react';
import pencilIcon from '../assets/gui-icons/glyphicons-basic-31-pencil.svg';
import eraserIcon from '../assets/gui-icons/glyphicons-basic-250-eraser.svg';
import undoIcon from '../assets/gui-icons/glyphicons-basic-887-undo.svg';
import pathLineIcon from '../assets/gui-icons/glyphicons-basic-98-vector-path-line.svg';
import paletteIcon from '../assets/gui-icons/glyphicons-basic-248-palette.svg';
import textIcon from '../assets/gui-icons/glyphicons-basic-101-text.svg';
import {TweenMax} from 'gsap/TweenMax';


export default class SketchControls extends Component {
	constructor(props) {
		super(props);
		this.toggleAddDot = this.toggleAddDot.bind(this);
		this.toggleEraseDot = this.toggleEraseDot.bind(this);
		this.togglePathVisiblility = this.togglePathVisiblility.bind(this);
		this.handleUndoDot = this.handleUndoDot.bind(this);

		this.addBtnRef = React.createRef();
		this.eraseBtnRef = React.createRef();
		this.undoBtnRef = React.createRef();
		this.pathBtnRef = React.createRef();
		this.paletteBtnRef = React.createRef();
		this.textBtnRef = React.createRef();
	}

	componentDidMount() {
		(this.props.addDotEnableState) ? this.onButton(this.addBtnRef) : this.offButton(this.addBtnRef);
		// this.toggleAddDot();
		// this.offButton(this.eraseBtnRef);
		(this.props.eraseDotEnableState) ? this.onButton(this.eraseBtnRef) : this.offButton(this.eraseBtnRef);
		this.offButton(this.undoBtnRef);
		(this.props.showPathState) ? this.onButton(this.pathBtnRef) : this.offButton(this.pathBtnRef);
		// this.togglePathVisiblility();
		this.offButton(this.paletteBtnRef);
		this.offButton(this.textBtnRef);
	}

	onButton(element) {
		TweenMax.to(element, 0.2, {opacity:1, scale:1, ease:Power2.easeOut});
	}

	offButton(element) {
		TweenMax.to(element, 0.5, {opacity:0.2, scale:0.75, ease:Bounce.easeOut});
	}

	toggleAddDot() {
		(this.props.addDotEnableState) ?
			this.offButton(this.addBtnRef) :
			this.onButton(this.addBtnRef);
		this.props.toggleAddDot();
		this.offButton(this.eraseBtnRef);
	}

	toggleEraseDot() {
		(this.props.eraseDotEnableState) ?
			this.offButton(this.eraseBtnRef) :
			this.onButton(this.eraseBtnRef);
		this.props.toggleEraseDot();
		this.offButton(this.addBtnRef);
	}

	handleUndoDot() {
		this.props.handleUndoDot();
		TweenMax.to(this.undoBtnRef, 0.1, {opacity:1, scale:1, ease:Power2.easeOut, repeat:1, yoyoEase:Power2.easeOut});
	}

	togglePathVisiblility() {
		(this.props.showPathState) ?
			this.offButton(this.pathBtnRef) :
			this.onButton(this.pathBtnRef);
		this.props.togglePathVisibility();
	}

	render() {
		return(
			<div className='sketch-controls container fixed-bottom'>
				<img className='img-btn' src={pencilIcon} alt='Add dot' title='Add dot'
					onClick={this.toggleAddDot} ref={img => this.addBtnRef = img}
				/>
				<img className='img-btn' src={eraserIcon} alt='Erase dot' title='Erase dot'
					onClick={this.toggleEraseDot} ref={img => this.eraseBtnRef = img}
				/>
				<img className='img-btn' src={undoIcon} alt='Undo dot' title='Undo dot'
					onClick={this.handleUndoDot} ref={img => this.undoBtnRef = img}
				/>
				<img className='img-btn' src={pathLineIcon} alt='Show/Hide path line' title='Show/Hide path line' 
					onClick={this.togglePathVisiblility} ref={img => this.pathBtnRef = img}
				/>
				<img className='img-btn' src={paletteIcon} alt='Dots color options' title='Dots color options' ref={img => this.paletteBtnRef = img}/>
				<img className='img-btn' src={textIcon} alt='Add text' title='Add text' ref={img => this.textBtnRef = img}/>
			</div>
		);
	}
}
