// Experimental web app to create dot-to-dot images
// Using Matterjs, Paperjs and Reactjs as main libraries
// TODO:
// * User to upload an image as reference
// * Been able to scale and rotate the image
// * Adding dots with mouse clicks
// * Add ability to undo or erase dots
// * Add export to PDF or print the resulting image
import React, {Fragment} from 'react';
import paper from 'paper';
import Matter from 'matter-js';


export default function Sketch() {
	// Matterjs physics variables
	let engine,
		Engine,
		World,
		Bodies,
		Render;

	// Paperjs render variables
	let size;

	let showRender = false;


	window.onload = function() {
		paper.install(window);
		paper.setup('paper-canvas');
		
		// Stores window size width and height
		size = view.size;

		// Initial engine setup
		Engine = Matter.Engine;
		World = Matter.World;
		Bodies = Matter.Bodies;
		Render = Matter.Render;
		engine = Engine.create();

		// Draw walls
		// ground
		addBox(size.width / 2, size.height - 10, size.width, 100, true);
		// left wall
		addBox(25, size.height / 2, 50, size.height, true);
		// right wall
		addBox(size.width - 25, size.height / 2, 50, size.height, true);

		// Shows engine debug render
		if (showRender) {
			var render = Render.create({
				element: document.getElementById('render-container'),
				canvas: document.getElementById('matter-canvas'),
				engine: engine
			});
			render.canvas.width = size.width;
			render.canvas.height = size.height;
			Render.run(render);

			let bounds = new Shape.Rectangle({
				point: [0, 0],
				size: [size.width, size.height],
				strokeColor: 'grey',
				strokeWidth: 10
			});
		}


		// Kicks off animation loop
		view.onFrame = draw;
		Engine.run(engine);
	}

	function draw(event) {
		const bodies = engine.world.bodies;
		for (let i = 0; i < bodies.length; i++) {
			var body = bodies[i];
			var shape = body.shape;
			shape.position = body.position;
			shape.rotation =  body.angle * 180 / Math.PI;
		}
	}

	function attachBodyShape(body, shape) {
		body.shape = shape;
		body.friction = 0;
		World.add(engine.world, body);
	}

	function addCircle(x, y, r, isStatic) {
		const shape = new Shape.Circle({
			point: [x, y],
			radius: r,
			fillColor: Color.random()
		});
		const body = Bodies.circle(x, y, r, Object.assign({isStatic: isStatic}));
		attachBodyShape(body, shape);
	}

	function addBox(x, y, w, h, isStatic) {
		const shape = new Shape.Rectangle({
											point: [x, y],
											size: [w, h],
											fillColor: (isStatic) ? 'grey' : Color.random()
										});
		const body = Bodies.rectangle(x, y, w, h, Object.assign({isStatic: isStatic}));
		attachBodyShape(body, shape);
	}

	function addDot(event) {
		const x = event.clientX,
			  y = event.clientY,
			  r = Math.random() * 10 + 5;
		addCircle(x, y, r, false);
	}

	return (
		<Fragment>
			{
				showRender
				? <canvas id='matter-canvas' resize='true' />
				: null 
			}
			
			<canvas id='paper-canvas' resize='true' onClick={addDot} />
		</Fragment>
	);
}