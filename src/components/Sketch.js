// Experimental web app to create dot-to-dot images
// Using Paperjs and Reactjs as main libraries
// TODO:
// * User to upload an image as reference
// * Been able to adjust the image
// * Adding dots with mouse clicks
// * Add ability to undo or erase dots
// * Add export to PDF or print the resulting image
import React, {Component, Fragment} from 'react';
import paper from 'paper';
import Dot from './Dot';
import SketchControls from './SketchControls';

export default class Sketch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			addDotEnable: true,
			eraseDotEnable: false,
			showPath: true
		};
		
		// Paperjs render variables
		this.path;
		this.dots = [];
		this.dot_id = 0;
		this.points = [];

		// SketchControl functions
		this.handleMouseClick = this.handleMouseClick.bind(this);
		this.togglePathVisibility = this.togglePathVisibility.bind(this);
		this.toggleAddDot = this.toggleAddDot.bind(this);
		this.toggleEraseDot = this.toggleEraseDot.bind(this);
		this.handleUndoDot = this.handleUndoDot.bind(this);

		this.addDot = this.addDot.bind(this);
		this.eraseDot = this.eraseDot.bind(this);
		this.undoDot = this.undoDot.bind(this);
		this.updateDotNumbers = this.updateDotNumbers.bind(this);
	}
	
	componentDidMount() {
		// Paperjs initialization settings
		paper.install(window);
		paper.setup('paper-canvas');
		// console.log("Paper loaded");	
		
		// Creates a new path line that shows the connected dots
		this.path = new Path();
		this.path.strokeColor = 'black';
		this.path.visible = this.state.showPath;
		// this.path.selected = true;
		
		// Kicks off animation loop
		// view.onFrame = draw;
	}

	togglePathVisibility() {
		this.setState({showPath: !this.state.showPath});
		// console.log("show path:", this.state.showPath);
		this.path.visible = this.state.showPath;
	}

	toggleAddDot() {
		this.setState({addDotEnable: !this.state.addDotEnable});
		if (this.state.eraseDotEnable) {
			this.toggleEraseDot();		
		}
	}

	toggleEraseDot() {
		this.setState({eraseDotEnable: !this.state.eraseDotEnable});
		if (this.state.addDotEnable) {
			this.toggleAddDot();		
		}
	}

	handleUndoDot() {
		this.undoDot();
	}

	// function draw(event) {}

	handleMouseClick(event) {
		// console.log("Add dot enable:", this.state.addDotEnable);
		// console.log("Erase dot enable:", this.state.eraseDotEnable);
		if (this.state.addDotEnable) {
			this.addDot(event);
		}
		else if (this.state.eraseDotEnable) {
			this.eraseDot(event);
		}
		else {
			console.log("neither add or erase dots are enabled");
		}
	}

	addDot(event) {
		// Creates a new point at mouse position
		const position = new Point(event.clientX, event.clientY);
		
		// Check if mouse position is too close to the other dots
		if (this.path.segments.every(segment => segment.point.getDistance(position) >= 10)) {
			// Creates a new colour that auto change its tint
			const color = new Color('red');
			color.hue -= this.dot_id;
			// Creates a new Dot object and store its in an array
			const dot = new Dot(this.dot_id, position, color);
			this.dots.push(dot);
			// Increment dot id number
			this.dot_id++;
			
			// Add points to the path line
			this.path.add(position);
			this.points.push(position);
		}
		else {
			// Display a message to notify the issue
			console.log("Too close to the previous point");
		}
	}

	eraseDot(event) {
		const point = new Point(event.clientX, event.clientY);
		const hitOptions = {
			segments: true,
			tolerance: 20
		};

		const hitResult = this.path.hitTest(point, hitOptions);
		if (!hitResult) return;
		if (hitResult.type == 'segment') {
			const dotIndex = hitResult.segment.index;
			hitResult.segment.remove();
			this.dots[dotIndex].remove();
			this.dots.splice(dotIndex, 1);
			this.updateDotNumbers();
		}
	}

	updateDotNumbers() {
		for (const [i, d] of Array.from(this.dots.entries())) {
			d.id.content = i;
		}
		this.dot_id--;
	}

	undoDot() {
		const lastPointIndex = this.path.segments.length;
		if (lastPointIndex > 0) {
			this.path.removeSegment(lastPointIndex - 1);
			const removedDot = this.dots.pop();
			removedDot.remove();
			this.dot_id--;
		}
		console.log("Undo last dot", lastPointIndex);
	}

	render() {
		return (
			<Fragment>
				<canvas id='paper-canvas' resize='true' onClick={this.handleMouseClick} />
				<SketchControls
					toggleAddDot={this.toggleAddDot}
					handleUndoDot={this.handleUndoDot}
					toggleEraseDot={this.toggleEraseDot}
					togglePathVisibility={this.togglePathVisibility}
				/>
			</Fragment>
		);
	}
}