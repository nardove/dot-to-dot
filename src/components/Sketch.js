// Experimental web app to create dot-to-dot images
// Using Paperjs and Reactjs as main libraries
// TODO:
// * User to upload an image as reference
// * Been able to scale and rotate the image
// * Adding dots with mouse clicks
// * Add ability to undo or erase dots
// * Add export to PDF or print the resulting image
import React, {Fragment} from 'react';
import paper from 'paper';
import Dot from './Dot';


export default function Sketch() {

	// Paperjs render variables
	let path;
	let showPath = true;

	let dots = [];
	let dot_id = 0;

	window.onload = function() {
		// Paperjs initialization settings
		paper.install(window);
		paper.setup('paper-canvas');

		// Creates a new path line that shows the connected dots
		path = new Path();
		path.strokeColor = 'black';

		// Kicks off animation loop
		view.onFrame = draw;
	}

	function draw(event) {
		// Render path line, toggles by the click of a button
		path.visible = showPath;

		// Renders all dots
		// for (let dot of dots) dot.render();
	}
	

	function addDot(event) {
		// Creates a new point at mouse position
		const position = new Point(event.clientX, event.clientY);
		// Creates a new colour that auto change its tint
		const color = new Color('cyan');
		color.hue += dot_id;
		// Creates a new Dot object and store its in an array
		const dot = new Dot(dot_id, position, color);
		dots.push(dot);
		// Increment dot id number
		dot_id++;

		// Add points to the path line
		path.add(position);
	}


	return (
		<Fragment>
			<canvas id='paper-canvas' resize='true' onClick={addDot} />
		</Fragment>
	);
}