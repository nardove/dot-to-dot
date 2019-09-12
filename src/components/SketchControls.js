import React, {Component} from 'react';
import pencilIcon from '../assets/gui-icons/glyphicons-basic-31-pencil.svg';
import eraserIcon from '../assets/gui-icons/glyphicons-basic-250-eraser.svg';
import undoIcon from '../assets/gui-icons/glyphicons-basic-887-undo.svg';
import pathLineIcon from '../assets/gui-icons/glyphicons-basic-98-vector-path-line.svg';
import paletteIcon from '../assets/gui-icons/glyphicons-basic-248-palette.svg';
import textIcon from '../assets/gui-icons/glyphicons-basic-101-text.svg';


export default class SketchControls extends Component {
	constructor(props) {
		super(props);
		this.toggleAddDot = this.toggleAddDot.bind(this);
		this.toggleEraseDot = this.toggleEraseDot.bind(this);
		this.togglePathVisiblility = this.togglePathVisiblility.bind(this);
		this.handleUndoDot = this.handleUndoDot.bind(this);
	}

	toggleAddDot() {
		this.props.toggleAddDot();
	}

	toggleEraseDot() {
		this.props.toggleEraseDot();
	}

	handleUndoDot() {
		this.props.handleUndoDot();
	}

	togglePathVisiblility() {
		this.props.togglePathVisibility();
	}

	render() {
		return(
			<div className='sketch-controls container fixed-bottom'>
				<img src={pencilIcon} alt='Add dot' title='Add dot'
					onClick={this.toggleAddDot}
				/>
				<img src={undoIcon} alt='Undo dot' title='Undo dot'
					onClick={this.handleUndoDot}
				/>
				<img src={eraserIcon} alt='Erase dot' title='Erase dot'
					onClick={this.toggleEraseDot}
				/>
				<img src={pathLineIcon} alt='Show/Hide path line' title='Show/Hide path line' 
					onClick={this.togglePathVisiblility}
				/>
				<img src={paletteIcon} alt='Dots color options' title='Dots color options' />
				<img src={textIcon} alt='Add text' title='Add text' />
			</div>
		);
	}
}
