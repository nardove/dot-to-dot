import paper from 'paper';
import Matter from 'matter-js';


export default function Sketch() {
	let Engine, World, Bodies, Render;
	let box, boxA, boxB;
	let posX = 200,
		posY = 140,
		sizeW = 80,
		sizeH = 40;
	
	window.onload = function() {
		paper.install(window);
		paper.setup('paper-canvas');
		
		let size = view.size;
		console.log(size);

		Engine = Matter.Engine;
		World = Matter.World;
		Bodies = Matter.Bodies;
		Render = Matter.Render;
		
		let	engine = Engine.create();

		boxA = Bodies.rectangle(posX, posY, sizeW, sizeH);
		boxA.angle = 0;

		boxB = Bodies.rectangle(posX + 40, size.height - 10 - sizeH, sizeW, sizeH);

		let ground = Bodies.rectangle(size.width / 2, size.height - 10, size.width, 100, {isStatic: true});
		
		World.add(engine.world, [boxA, boxB, ground]);

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
		}

		box = new Shape.Rectangle({
			point: [posX, posY],
			size: [sizeW, sizeH],
			fillColor: 'pink'
		});

		let bounds = new Shape.Rectangle({
			point: [0, 0],
			size: [size.width, size.height],
			strokeColor: 'red',
			strokeWidth: 10
		});

		view.onFrame = draw;
		Engine.run(engine);
	}

	function draw(event) {
		box.position = boxA.position;
		box.rotation = boxA.angle * 180 / Math.PI;
	}

	return null;
}