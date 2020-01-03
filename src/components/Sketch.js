// Experimental web app to create dot-to-dot images
// Using  Reactjs and Paperjs as drawing engine
//
// TODO:
// - Add a title to the drawing that can be optional
// - Implement dot colour customization
// - Work on the Information panel
// 

import React, { Component, Fragment } from 'react';
import paper, { Group, Shape, Point, Path, Color, Raster } from 'paper';
import Dot from './Dot';
import SketchControls from './SketchControls';
import IOControls from './IOControls';
import Header from './Header';
import jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';

const snackText = {
	fontFamily: 'Quicksand',
	textAlign: 'center'
}

export default class Sketch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			addDotEnable: true,
			eraseDotEnable: false,
			showPath: false,
			currentColour: { h: 0, s: 1, l: 0.5, a: 1 },
			imageOpacity: 0.5,
			imageScale: 1,
			openSnackbarAddDotState: false
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
		this.drawingTitle = '';

		// SketchControl functions
		this.togglePathVisibility = this.togglePathVisibility.bind(this);
		this.toggleAddDot = this.toggleAddDot.bind(this);
		this.toggleEraseDot = this.toggleEraseDot.bind(this);
		this.handleUndoDot = this.handleUndoDot.bind(this);
		this.addDot = this.addDot.bind(this);
		this.eraseDot = this.eraseDot.bind(this);
		this.undoDot = this.undoDot.bind(this);
		this.updateDotNumbers = this.updateDotNumbers.bind(this);
		this.deleteAllDots = this.deleteAllDots.bind(this);
		this.handleColourChange = this.handleColourChange.bind(this);

		// IOControl functions
		this.addImageToRaster = this.addImageToRaster.bind(this);
		this.adjustImageRaster = this.adjustImageRaster.bind(this);
		this.exportDrawing = this.exportDrawing.bind(this);

		// General functions
		this.handleMouseClick = this.handleMouseClick.bind(this);
		this.handleWindowResize = this.handleWindowResize.bind(this);
		this.updateDrawingTitle = this.updateDrawingTitle.bind(this);
		this.handleAddDotSnackbarClose = this.handleAddDotSnackbarClose.bind(this);
	}

	componentDidMount() {
		// Paperjs initialization settings
		this.canvas = document.getElementById('paper-canvas');
		const width = 800;
		const height = window.innerHeight - 200;
		this.canvas.width = width;
		this.canvas.height = height;
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
		this.group.addChild(this.path);

		// window.addEventListener('resize', this.handleWindowResize);
	}

	// Setting canvas max-width breaks thes resize eventlistener and makes the method redundant
	handleWindowResize() {
		const width = 800;
		const height = window.innerHeight - 200;
		this.canvas.width = width;
		this.canvas.height = height;
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
		if (this.path.segments.every(segment => segment.point.getDistance(position) >= 10)) {
			// Creates a new colour that auto change its tint
			const { h, s, l } = this.state.currentColour;
			const colour = new Color({ hue: h, saturation: s, lightness: l });
			(colour.hue >= 359) ? colour.hue = 0 : colour.hue += 2;
			// Udapte colour after it is been applied
			this.handleColourChange({ h: colour.hue, s: colour.saturation, l: colour.lightness });

			// Creates a new Dot object and store it in an array
			const dot = new Dot(this.dot_id, position, colour, this.group);
			this.dots.push(dot);
			// Increment dot id number
			this.dot_id++;

			// Add points to the path line
			this.path.add(position);
			this.points.push(position);
		} else {
			// Display a message to notify the issue
			this.setState({ openSnackbarAddDotState: true });
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
				// console.log('hit:', dotIndex, this.path.segments.length);
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
		// console.log('Undo last dot', lastPointIndex);
	}

	deleteAllDots() {
		for (const d of this.dots) d.remove(true);
		this.path.removeSegments();
		this.dots = [];
		this.dot_id = 0;
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
		this.rasterGrp.opacity = this.state.imageOpacity;
		this.rasterGrp.addChild(this.raster);
	}

	adjustImageRaster(sliderObj) {
		// console.log('adjusting image', sliderObj);
		if (sliderObj.type === 'opacity') {
			// this.rasterGrp.opacity = sliderObj.value;
			this.setState({ imageOpacity: sliderObj.value });
			this.rasterGrp.opacity = this.state.imageOpacity;
		} else if (sliderObj.type === 'scale') {
			// for the scaling to work applyMatrix needs to be set to false on the target object
			// this.rasterGrp.scaling = sliderObj.value;
			this.setState({ imageScale: sliderObj.value });
			this.rasterGrp.scaling = this.state.imageScale;
		}
	}

	exportDrawing() {
		// console.log('Initializing PDF export');

		const fileName = 'dot-to-dot-drawing.pdf'

		// Before we capture the canvas, first hide the raters object
		this.rasterGrp.visible = false;
		this.viewRect.strokeColor = 'white';
		for (const d of this.dots) {
			d.shape.radius = 1.3;
			d.id.fontSize = 7;
		}

		if (this.state.showPath) this.path.visible = false;

		// Refresh paperjs canvas
		paper.view.draw();

		// Get a snapshot of the current dot-tod-t drawing
		// and generate PDF document
		html2canvas(this.canvas).then((canvas) => {
			const imgData = canvas.toDataURL('image/png');
			const doc = new jsPDF('p', 'px', 'a4');
			const ratio = this.canvas.offsetHeight / this.canvas.offsetWidth;
			const width = doc.internal.pageSize.getWidth() - 10;
			const height = ratio * width;
			const xPosition = 5;
			const yPosition = (doc.internal.pageSize.getHeight() - height) / 2;

			doc.setFontSize(14);
			doc.text('dot-to-dot', width / 2, 40, { align: 'center' });

			doc.setFontSize(10);
			doc.text('Connect the dots to solve the puzzle', width / 2, 60, { align: 'center' });

			doc.setFontSize(18);
			doc.text(this.drawingTitle, width / 2, 60, { maxWidth: 300, align: 'center' });
			doc.addImage(imgData, 'PNG', xPosition, yPosition, width, height, 'NONE');

			doc.setFontSize(10);
			doc.text(`Total number of dots: ${this.dots.length}`, width / 2, doc.internal.pageSize.getHeight() - 30, { maxWidth: 300, align: 'center' });

			doc.save(fileName);
		});
		// After the pdf is created show the raster again
		this.viewRect.strokeColor = 'grey';
		for (const d of this.dots) {
			d.shape.radius = 2;
			d.id.fontSize = 10;
		}
		if (this.state.showPath) this.path.visible = true;
		this.rasterGrp.visible = true;
	}

	updateDrawingTitle(event) {
		this.drawingTitle = event.target.value;
	}

	handleFocus = (event) => event.target.select();

	handleColourChange(colour) {
		// console.log(colour);
		this.setState({ currentColour: colour });
		// console.log('current colour: ', this.state.currentColour);
	}

	handleAddDotSnackbarClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		this.setState({ openSnackbarAddDotState: false });
	}


	render() {
		return (
			<Fragment>
				<img id='paper-img' className='paper-img' title='loaded image' />
				<Grid container direction='column' justify='space-evenly' alignItems='center' style={{ height: '100%' }}>
					<Grid item style={{ width: '800px' }} >
						<Grid container direction='row' justify='space-between' alignItems='center'>
							<Grid item>
								<Header />
							</Grid>
							<Grid item>
								<IOControls
									addImageToRaster={this.addImageToRaster}
									adjustImageRaster={this.adjustImageRaster}
									exportDrawing={this.exportDrawing}
									imageOpacity={this.state.imageOpacity}
									imageScale={this.state.imageScale}
								/>
							</Grid>
						</Grid>
					</Grid>

					<Grid item style={{ width: '400px' }}>
						<InputBase
							defaultValue='Untitled'
							onChange={this.updateDrawingTitle}
							onFocus={this.handleFocus}
							fullWidth={true}
							inputProps={{ style: { textAlign: 'center', color: '#909090' } }}
						/>
					</Grid>

					<Grid item>
						<canvas id='paper-canvas' className='paperCanvas' />
					</Grid>

					<Grid item>
						<SketchControls
							currentColour={this.state.currentColour}
							addDotEnableState={this.state.addDotEnable}
							eraseDotEnableState={this.state.eraseDotEnable}
							showPathState={this.state.showPath}
							handleUndoDot={this.handleUndoDot}
							toggleAddDot={this.toggleAddDot}
							toggleEraseDot={this.toggleEraseDot}
							togglePathVisibility={this.togglePathVisibility}
							deleteAllDots={this.deleteAllDots}
							handleColourChange={this.handleColourChange}
						/>
					</Grid>
				</Grid>
				<Snackbar
					anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
					open={this.state.openSnackbarAddDotState}
					autoHideDuration={3000}
					onClose={this.handleAddDotSnackbarClose}
					message={<Typography style={snackText}>Can't add dots too close to each other</Typography>}
				/>
			</Fragment>
		);
	}
}
