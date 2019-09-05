// Experimental web app to create dot-to-dot images
// Using Paperjs and Reactjs as main libraries
// TODO:
// * User to upload an image as reference
// * Been able to adjust the image
// * Adding dots with mouse clicks
// * Add ability to undo or erase dots
// * Add export to PDF or print the resulting image
import React, {Fragment, useState, useEffect} from 'react';
import paper from 'paper';
import Dot from './Dot';


// Paperjs render variables
let path;
let dots = [];
let dot_id = 0;
let points = [];


export default function Sketch(props) {
	
	window.onload = function() {
		// Paperjs initialization settings
		paper.install(window);
		paper.setup('paper-canvas');

		// Creates a new path line that shows the connected dots
		path = new Path();
		path.strokeColor = 'black';
		path.visible = props.isPathVisible;

		// Kicks off animation loop
		// view.onFrame = draw;

		view.onMouseDown = function(event) {
			addDot(event.point);
		}
	}
	
	useEffect(function() {
		if (path != undefined) { path.visible = props.isPathVisible; }
		console.log(path, props.isPathVisible);
	});

	// function draw(event) {}

	function addDot(point) {
		// Creates a new point at mouse position
		const position = new Point(point.x,point.y);
		
		// Check if mouse position is too close to the other dots
		if (path.segments.every(segment => segment.point.getDistance(position) >= 10)) {
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
			points.push(position);
		}
		else {
			console.log("Too close to the previous point");
		}
	}

		
	// return (
	// 	<Fragment>
	// 		<canvas id='paper-canvas' resize='true' onClick={addDot} />
	// 	</Fragment>
	// );
	return null;
}