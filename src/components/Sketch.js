/*	
Experimental web app to create dot-to-dot images
Using  Reactjs and Paperjs as drawing engine
*/

import React, { Component, Fragment } from 'react';
import paper, { Group, Shape, Point, Path, Color, Raster } from 'paper';
import Dot from './Dot';
import SketchControls from './SketchControls';
import IOControls from './IOControls';
import Header from './Header';
import InputBase from '@material-ui/core/InputBase';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import gsap from 'gsap';
import FileSaver from 'file-saver';
const SVGtoPDF = require('svg-to-pdfkit');
const PDFDocument = require('svg-to-pdfkit/examples/pdfkit');
const blobStream = require('blob-stream');

const snackText = {
	fontFamily: 'Quicksand',
	textAlign: 'center'
};

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
		this.logoSvgData = '';

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
		this.updateDrawingTitle = this.updateDrawingTitle.bind(this);
		this.handleAddDotSnackbarClose = this.handleAddDotSnackbarClose.bind(this);
		// this.handleWindowResize = this.handleWindowResize.bind(this);
	}

	componentDidMount() {
		// Paperjs initialization settings
		this.canvas = document.getElementById('paper-canvas');
		const sketch = this.canvas.parentNode;
		const width = sketch.clientWidth;
		const height = sketch.clientHeight;
		this.canvas.width = width;
		this.canvas.height = height;

		// paperjs initialization
		paper.setup(this.canvas);

		this.group = new Group();
		this.rasterGrp = new Group();
		this.rasterGrp.applyMatrix = false;

		this.viewRect = new Shape.Rectangle(0, 0, width, height);
		this.viewRect.strokeColor = 'grey';
		// this.viewRect.strokeWidth = 0.7;
		this.viewRect.fillColor = 'white';

		this.group.position = new Point(width / 2, height / 2);
		this.group.addChild(this.viewRect);
		this.group.addChild(this.rasterGrp);

		// Adds Mouse event to group
		// allows for a better control as of where the user draw
		this.group.onMouseDown = (event) => {
			this.handleMouseClick(event);
		};

		// Creates a new path line that shows the connected dots
		this.path = new Path();
		this.path.strokeColor = 'black';
		this.path.visible = this.state.showPath;
		this.group.addChild(this.path);

		const tl = gsap.timeline();
		tl.fromTo(
			this.headerRef,
			{ opacity: 0, x: -40 },
			{ opacity: 1, x: 0, ease: 'power4.in', duration: 0.3, delay: 1 }
		);
		tl.fromTo(
			this.ioControlsRef,
			{ opacity: 0, x: -40 },
			{ opacity: 1, x: 0, ease: 'elastic.out(1, 0.3)', duration: 0.5 },
			'<0.35'
		);
		tl.fromTo(
			this.inputBaseRef,
			{ opacity: 0, y: -20 },
			{ opacity: 1, y: 0, ease: 'power2.out', duration: 0.2 }
		);
		tl.fromTo(this.canvasRef, { opacity: 0 }, { opacity: 1, duration: 1 });
		tl.fromTo(
			this.sketchControlsRef,
			{ opacity: 0, y: 30 },
			{ opacity: 1, y: 0, ease: 'elastic.out(1, 0.3)', duration: 0.6 }
		);

		// window.addEventListener('resize', this.handleWindowResize);
	}

	// Setting canvas max-width breaks thes resize eventlistener and makes the method redundant
	// handleWindowResize() {
	// 	consthis.canvas = document.getElementById('paper-canvas');
	// 	const sketch = this.canvas.parentNode;
	// 	const width = sketch.clientWidth;
	// 	const height = sketch.clientHeight;
	// 	this.canvas.width = width;
	// 	this.canvas.height = height;
	// }

	togglePathVisibility() {
		this.setState({ showPath: !this.state.showPath }, () => {
			this.path.visible = this.state.showPath;
		});
	}

	toggleAddDot() {
		this.setState({ addDotEnable: !this.state.addDotEnable });
		if (this.state.eraseDotEnable) this.toggleEraseDot();
	}

	toggleEraseDot() {
		this.setState({ eraseDotEnable: !this.state.eraseDotEnable });
		if (this.state.addDotEnable) this.toggleAddDot();
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
		if (this.path.segments.every((segment) => segment.point.getDistance(position) >= 10)) {
			// Creates a new colour that auto change its tint
			const { h, s, l } = this.state.currentColour;
			const colour = new Color({ hue: h, saturation: s, lightness: l });
			colour.hue >= 359 ? (colour.hue = 0) : (colour.hue += 2);
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
		this.dots.some((dot) => {
			const hit = dot.shape.hitTest(point, { fill: true, tolerance: 5 });
			if (hit != null) {
				const dotIndex = parseInt(dot.id.content);
				this.path.removeSegment(dotIndex);
				this.dots[dotIndex].remove();
				this.dots.splice(dotIndex, 1);
				this.updateDotNumbers();
				return;
			}
		});
	}

	updateDotNumbers() {
		for (const [i, d] of Array.from(this.dots.entries())) d.id.content = i;

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
	}

	deleteAllDots() {
		this.path.removeSegments();
		this.dots.forEach((dot) => dot.remove(true));
		this.dots = [];
		this.dot_id = 0;
	}

	addImageToRaster() {
		// Check if there is an image already loaded
		// if so clears the raster addDotEnableState,
		if (this.raster !== null) {
			this.raster.clear();
			this.rasterGrp.removeChildren();
		}
		// otherwise adds the new loaded image
		this.raster = new Raster('paper-img');
		this.raster.position = new Point(this.canvas.offsetWidth / 2, this.canvas.offsetHeight / 2);
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
		// Before we capture the canvas, first hide the raters object
		this.rasterGrp.visible = false;
		this.viewRect.strokeColor = 'white';
		this.dots.forEach((dot) => {
			dot.shape.radius = 1.5;
			dot.id.fontSize = 8;
		});
		if (this.state.showPath) this.path.visible = false;

		// Refresh paperjs canvas
		paper.view.draw();

		const docPageSize = {
			width: 596,
			height: 842
		};

		const docTextOptions = {
			width: docPageSize.width,
			align: 'center'
		};

		const ratio = this.canvas.offsetHeight / this.canvas.offsetWidth;
		const margin = 10;
		const sketchSvgOptions = {
			// https://github.com/alafr/SVG-to-PDFKit/issues/24
			width: parseFloat(docPageSize.width - margin),
			height: parseFloat(ratio * docPageSize.width - margin)
			// preserveAspectRatio: '1:1'
		};

		const sketchSvgData = paper.project.exportSVG({ asString: false });
		sketchSvgData.setAttribute('width', '100%');

		const appLogo = document.getElementById('app-logo');
		const appLogoSrc = appLogo.getSVGDocument().getElementById('Layer 0');
		appLogoSrc.setAttribute('width', '100%');

		const doc = new PDFDocument({
			size: [docPageSize.width, docPageSize.height],
			// size: 'A7',
			margins: {
				top: 0,
				bottom: 0,
				left: 0,
				right: 0
			}
		});
		const stream = doc.pipe(blobStream());

		SVGtoPDF(doc, appLogoSrc, 250, 15, { width: 100, height: 50 });

		doc.font('Helvetica');
		doc.fontSize(14);
		doc.text('dot-to-dot', 0, 80, docTextOptions);
		doc.fontSize(10);
		doc.moveDown();
		doc.text('Connect the dots to solve the puzzle', docTextOptions);
		doc.moveDown();
		doc.moveDown();
		doc.fontSize(14);
		doc.text(this.drawingTitle, docTextOptions);

		SVGtoPDF(doc, sketchSvgData, margin / 2, 150, sketchSvgOptions);

		doc.fontSize(10);
		doc.text(
			`Total number of dots: ${this.dots.length}`,
			0,
			docPageSize.height - 25,
			docTextOptions
		);
		doc.end();

		stream.on('finish', function() {
			const blob = stream.toBlob('application/pdf');
			FileSaver.saveAs(blob, 'dot-to-dot.pdf');
		});

		// After the pdf is created show the raster again
		this.viewRect.strokeColor = 'grey';
		this.dots.forEach((dot) => {
			dot.shape.radius = 2;
			dot.id.fontSize = 10;
		});
		if (this.state.showPath) this.path.visible = true;
		this.rasterGrp.visible = true;
	}

	updateDrawingTitle(event) {
		this.drawingTitle = event.target.value;
	}

	handleFocus = (event) => event.target.select();

	handleColourChange(colour) {
		this.setState({ currentColour: colour });
	}

	handleAddDotSnackbarClose = (event, reason) => {
		if (reason === 'clickaway') return;
		this.setState({ openSnackbarAddDotState: false });
	};

	render() {
		return (
			<div className='wrapper' id='wrapper'>
				<img id='paper-img' className='paper-img' title='loaded image' />

				<div className='header' ref={(div) => (this.headerRef = div)}>
					<Header />
				</div>

				<div className='io-controls' ref={(div) => (this.ioControlsRef = div)}>
					<IOControls
						addImageToRaster={this.addImageToRaster}
						adjustImageRaster={this.adjustImageRaster}
						exportDrawing={this.exportDrawing}
						imageOpacity={this.state.imageOpacity}
						imageScale={this.state.imageScale}
					/>
				</div>

				<div className='sketch-title' ref={(div) => (this.inputBaseRef = div)}>
					<InputBase
						defaultValue='Untitled'
						onChange={this.updateDrawingTitle}
						onFocus={this.handleFocus}
						fullWidth={true}
						inputProps={{ style: { textAlign: 'center', color: '#909090' } }}
					/>
				</div>

				<div className='sketch-canvas' ref={(div) => (this.canvasRef = div)}>
					<canvas id='paper-canvas' />
				</div>

				<div className='sketch-controls' ref={(div) => (this.sketchControlsRef = div)}>
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
				</div>

				<Snackbar
					anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
					open={this.state.openSnackbarAddDotState}
					autoHideDuration={3000}
					onClose={this.handleAddDotSnackbarClose}
					message={
						<Typography style={snackText}>
							Can't add dots too close to each other
						</Typography>
					}
				/>
			</div>
		);
	}
}
