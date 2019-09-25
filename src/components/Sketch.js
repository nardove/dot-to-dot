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
import IOControls from './IOControls';


export default class Sketch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			addDotEnable: true,
			eraseDotEnable: false,
			showPath: false,
		};

		// Paperjs render variables
		this.path;
		this.dots = [];
		this.dot_id = 0;
		this.points = [];
		this.group = null; // will use this to hold all the drawing for easy window render and export to file
		this.raster = null;

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

		this.handleWindowResize = this.handleWindowResize.bind(this);

		// IOControl functions
		this.addImageToRaster = this.addImageToRaster.bind(this);
	}
	
	componentDidMount() {
		// Paperjs initialization settings
		paper.install(window);
		paper.setup('paper-canvas');
		// console.log("Paper loaded");	
		
		this.group = new Group();
		const offset = {x: 100, y: 110};
		// this.group.position = new Point(window.innerWidth / 2, window.innerHeight / 2);
		const rect = new Shape.Rectangle(offset.x, offset.y, window.innerWidth - (offset.x * 2), window.innerHeight - (offset.y * 2 - 20));
		rect.strokeColor = 'grey';
		rect.fillColor = 'white';
		// rect.selected = true;
		this.group.addChild(rect);

		// Adds Mouse event to group 
		// allows for a better control as of where the user draw
		this.group.onMouseDown = (event) => {
			this.handleMouseClick(event);
		}

		// Creates a new path line that shows the connected dots
		this.path = new Path();
		this.path.strokeColor = 'black';
		this.path.visible = this.state.showPath;
		// this.togglePathVisibility();
		this.group.addChild(this.path);

		window.addEventListener('resize', this.handleWindowResize);
	}
	
	handleWindowResize() {
		const centreAlign = new Point(window.innerWidth / 2, window.innerHeight / 2);
		this.group.position = centreAlign;
	}

	togglePathVisibility() {
		this.setState({showPath: !this.state.showPath}, () => {
			this.path.visible = this.state.showPath;
		});
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
		const position = event.point;
		
		// Check if mouse position is too close to the other dots
		if (this.path.segments.every(segment => segment.point.getDistance(position) >= 10)) {
			// Creates a new colour that auto change its tint
			const color = new Color('yellow');
			color.hue -= this.dot_id + 50;
			// Creates a new Dot object and store its in an array
			const dot = new Dot(this.dot_id, position, color, this.group);
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
		const point = event.point;
		this.dots.some(dot => {
			const hit = dot.shape.hitTest(point, {fill: true, tolerance: 5});
			if (hit != null) {
				const dotIndex = parseInt(dot.id.content);
				this.path.removeSegment(dotIndex);
				this.dots[dotIndex].remove();
				this.dots.splice(dotIndex, 1);
				this.updateDotNumbers();
				// console.log("hit:", dotIndex, this.path.segments.length);
				return;
			}
		});
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
		// console.log("Undo last dot", lastPointIndex);
	}


	addImageToRaster() {
		console.log('add image to raster');
		this.raster = new Raster('paper-img');
		this.raster.position = new Point(window.innerWidth / 2, window.innerHeight / 2);
		this.raster.opacity = 0.1;
		this.group.addChild(this.raster);
	}


	render() {
		return (
			<Fragment>
				<img id='paper-img' />
				<canvas id='paper-canvas' resize='true' />
				<SketchControls
					addDotEnableState={this.state.addDotEnable}
					eraseDotEnableState={this.state.eraseDotEnable}
					showPathState={this.state.showPath}

					toggleAddDot={this.toggleAddDot}
					handleUndoDot={this.handleUndoDot}
					toggleEraseDot={this.toggleEraseDot}
					togglePathVisibility={this.togglePathVisibility}
				/>
				<IOControls addImageToRaster={this.addImageToRaster} />
			</Fragment>
		);
	}
}