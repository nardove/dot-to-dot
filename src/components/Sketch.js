import paper from 'paper';
import Matter from 'matter-js';


export default function Sketch() {
	let Engine, Render, World, Bodies;

	let rect;

	window.onload = function() {
		paper.install(window);
		paper.setup('paper-canvas');

		Engine = Matter.Engine;
		Render = Matter.Render;
		World = Matter.World;
		Bodies = Matter.Bodies;
		let	engine = Engine.create();
		let render = Render.create({
			element: document.body,
			engine: engine
		});

		let boxA = Bodies.rectangle(400, 200, 80, 80);
		let boxB = Bodies.rectangle(450, 50, 80, 80);
		let ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

		
		World.add(engine.world, [boxA, boxB, ground]);
		Engine.run(engine);
		Render.run(render);

		rect = new Path.Rectangle({
			point: [100, 100],
			size: [50, 80],
			strokeColor: 'black'
		});
		view.onFrame = draw;
	}

	function draw(event) {
		rect.rotate(3);
	}

	return null;
}