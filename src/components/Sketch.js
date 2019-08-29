import paper from 'paper';
import Matter from 'matter-js';


export default function Sketch() {
	let engine, Engine, World, Bodies, Render;
	
	window.onload = function() {
		paper.install(window);
		paper.setup('paper-canvas');
		
		let size = view.size;

		Engine = Matter.Engine;
		World = Matter.World;
		Bodies = Matter.Bodies;
		Render = Matter.Render;
		engine = Engine.create();

		for (let i=0; i < 10; i++) {
			let posX = size.width / 2 + Math.random() * 400 - 200,
				posY = Math.random() * 100,
				sizeW = Math.random() * 80 + 20,
				sizeH = Math.random() * 80 + 20,
				radius = Math.random() * 80 + 15;

			addBox(posX, posY, sizeW, sizeH, false);
			addCircle(posX, posY, radius, false);
		}
		// ground
		addBox(size.width / 2, size.height - 10, size.width, 100, true);
		// left wall
		addBox(25, size.height / 2, 50, size.height, true);
		// right wall
		addBox(size.width - 25, size.height / 2, 50, size.height, true);

		let showRender = true;
		if (!showRender) {
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

	return null;
}