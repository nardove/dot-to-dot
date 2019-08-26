import paper from 'paper';

export default function Sketch() {
	
	let rect;

	window.onload = function() {
		paper.install(window);
		paper.setup('paper-canvas');

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