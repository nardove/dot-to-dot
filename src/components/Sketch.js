// Experimental web app to create dot-to-dot images
// Using Paperjs and Reactjs as main libraries
// TODO:
// * User to upload an image as reference
// * Been able to adjust the image
// * Adding dots with mouse clicks
// * Add ability to undo or erase dots
// * Add export to PDF or print the resulting image
import React, { Component, Fragment } from 'react';
import paper, { Group, Shape, Point, Path, Color, Raster } from 'paper';
import Dot from './Dot';
import SketchControls from './SketchControls';
import IOControls from './IOControls';
import jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';


export default class Sketch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			addDotEnable: true,
			eraseDotEnable: false,
			showPath: false
		};

		// Paperjs objects
		this.path;
		this.dots = [];
		this.dot_id = 0;
		this.points = [];
		this.group = null; // will use this to hold all the drawing for easy window render and export to file
		this.raster = null;
		this.canvas;
		this.rasterGrp;
		this.viewRect;

		// SketchControl functions
		this.togglePathVisibility = this.togglePathVisibility.bind(this);
		this.toggleAddDot = this.toggleAddDot.bind(this);
		this.toggleEraseDot = this.toggleEraseDot.bind(this);
		this.handleUndoDot = this.handleUndoDot.bind(this);
		this.addDot = this.addDot.bind(this);
		this.eraseDot = this.eraseDot.bind(this);
		this.undoDot = this.undoDot.bind(this);
		this.updateDotNumbers = this.updateDotNumbers.bind(this);

		// IOControl functions
		this.addImageToRaster = this.addImageToRaster.bind(this);
		this.adjustImageRaster = this.adjustImageRaster.bind(this);
		this.exportDrawing = this.exportDrawing.bind(this);

		// General functions
		this.handleMouseClick = this.handleMouseClick.bind(this);
		this.handleWindowResize = this.handleWindowResize.bind(this);
	}

	componentDidMount() {
		// Paperjs initialization settings
		this.canvas = document.getElementById('paper-canvas');
		// console.log("Paper loaded");
		// const width = this.canvas.offsetWidth;
		// const height = this.canvas.offsetHeight - 300;
		const width = 800;
		const height = window.innerHeight - 200;
		this.canvas.width = width;
		this.canvas.height = height;
		// this.canvas.style = '800px';
		// this.canvas.style.height = '600px';
		this.canvas.style.top = '110px';

		// paperjs initialization
		// paper.install(window);
		paper.setup(this.canvas);

		this.group = new Group();
		this.rasterGrp = new Group();
		this.rasterGrp.applyMatrix = false;

		this.viewRect = new Shape.Rectangle(0, 0, width, height);
		this.viewRect.strokeColor = 'grey';
		// this.viewRect.strokeWidth = 0.7;
		this.viewRect.fillColor = 'white';
		// console.log(this.viewRect.bounds);

		this.group.position = new Point(
			window.innerWidth / 2,
			window.innerHeight / 2
		);
		this.group.addChild(this.viewRect);
		this.group.addChild(this.rasterGrp);

		// Adds Mouse event to group
		// allows for a better control as of where the user draw
		this.group.onMouseDown = event => {
			this.handleMouseClick(event);
		};

		// Creates a new path line that shows the connected dots
		this.path = new Path();
		this.path.strokeColor = 'black';
		this.path.visible = this.state.showPath;
		// this.togglePathVisibility();
		this.group.addChild(this.path);

		// window.addEventListener('resize', this.handleWindowResize);
	}

	// Setting canvas max-width breaks thes resize eventlistener and makes the method redundant
	handleWindowResize() {
		const centreAlign = new Point(
			window.innerWidth / 2,
			window.innerHeight / 2
		);
		this.group.position = centreAlign;
	}

	togglePathVisibility() {
		this.setState({ showPath: !this.state.showPath }, () => {
			this.path.visible = this.state.showPath;
		});
	}

	toggleAddDot() {
		this.setState({ addDotEnable: !this.state.addDotEnable });
		if (this.state.eraseDotEnable) {
			this.toggleEraseDot();
		}
	}

	toggleEraseDot() {
		this.setState({ eraseDotEnable: !this.state.eraseDotEnable });
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
		} else if (this.state.eraseDotEnable) {
			this.eraseDot(event);
		} else {
			console.log('neither add or erase dots are enabled');
		}
	}

	addDot(event) {
		// Creates a new point at mouse position
		const position = event.point;

		// Check if mouse position is too close to the other dots
		if (
			this.path.segments.every(
				segment => segment.point.getDistance(position) >= 10
			)
		) {
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
		} else {
			// Display a message to notify the issue
			console.log('Too close to the previous point');
		}
	}

	eraseDot(event) {
		const point = event.point;
		this.dots.some(dot => {
			const hit = dot.shape.hitTest(point, { fill: true, tolerance: 5 });
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
		// console.log('add image to raster');
		// Check if there is an image already loaded
		// if so clears the raster addDotEnableState,
		if (this.raster !== null) {
			this.raster.clear();
			this.rasterGrp.removeChildren();
		}
		// otherwise adds the new loaded image
		this.raster = new Raster('paper-img');
		this.raster.position = new Point(
			this.canvas.offsetWidth / 2,
			this.canvas.offsetHeight / 2
		);
		this.rasterGrp.opacity = 0.1;
		this.rasterGrp.addChild(this.raster);
	}

	adjustImageRaster(sliderObj) {
		// console.log('adjusting image', sliderObj);
		if (sliderObj.type === 'opacity') {
			this.rasterGrp.opacity = sliderObj.value;
		} else if (sliderObj.type === 'scale') {
			// for the scaling to work applyMatrix needs to be set to false on the target object
			this.rasterGrp.scaling = sliderObj.value;
		}
	}


	exportDrawing() {
		console.log('Initializing PDF export');

		const fileName = "dot-to-dot-drawing.pdf"

		// Before we capture the canvas, first hide the raters object
		this.rasterGrp.visible = false;
		paper.view.draw();
		html2canvas(this.canvas).then((canvas) => {
			const imgData = canvas.toDataURL('image/png');
			const doc = new jsPDF('p', 'px', 'a4');
			const ratio = this.canvas.offsetHeight / this.canvas.offsetWidth;
			const width = doc.internal.pageSize.getWidth() - 10;
			const height = ratio * width;
			const xPosition = 5;
			const yPosition = (doc.internal.pageSize.getHeight() - height) / 2;
			doc.addImage(imgData, 'PNG', xPosition, yPosition, width, ratio * width, 'NONE');
			doc.text('dot-to-dot', xPosition, 10);
			doc.save(fileName);
		});
		// After the pdf is created show the raster again
		this.rasterGrp.visible = true;

		// const exportOptions = {
		// 	bounds: this.viewRect.bounds,
		// 	asString: false,
		// };
		// const svg = paper.project.exportSVG(exportOptions);
		// const url = "data:image/svg+xml;utf8," + encodeURIComponent(svg);
		// const link = document.createElement("a");
		// link.download = fileName;
		// link.href = url;
		// link.click();
	}

	render() {
		return (
			<Fragment>
				<img id='paper-img' title='loaded image' />
				<canvas id='paper-canvas' className='paperCanvas' />
				<SketchControls
					addDotEnableState={this.state.addDotEnable}
					eraseDotEnableState={this.state.eraseDotEnable}
					showPathState={this.state.showPath}
					handleUndoDot={this.handleUndoDot}
					toggleAddDot={this.toggleAddDot}
					toggleEraseDot={this.toggleEraseDot}
					togglePathVisibility={this.togglePathVisibility}
				/>
				<IOControls
					addImageToRaster={this.addImageToRaster}
					adjustImageRaster={this.adjustImageRaster}
					exportDrawing={this.exportDrawing}
				/>
			</Fragment>
		);
	}
}
