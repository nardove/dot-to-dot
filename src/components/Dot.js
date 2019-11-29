import { TweenMax } from 'gsap/TweenMax';
import { Shape, PointText } from 'paper';

export default class Dot {
	constructor(id, position, color, group) {
		this.id = new PointText({
			content: id,
			justification: 'center',
			fontSize: 10,
			// fontWeight: 'bold',
			fillColor: color,
			position: position.subtract(7)
		});
		this.position = position;
		this.color = color;
		this.dotSize = 2;
		this.shape = new Shape.Circle({
			position: position,
			radius: this.dotSize,
			fillColor: color
			// strokeColor: color
		});

		group.addChild(this.id);
		group.addChild(this.shape);

		TweenMax.fromTo(this.shape, 0.25,
			{ opacity: 0.5, radius: this.dotSize * 4 },
			{ opacity: 1, radius: this.dotSize, ease: Power1.easeIn });
	}

	remove() {
		this.id.remove();
		TweenMax.to(this.shape, 0.2,
			{
				opacity: 0.2, radius: this.dotSize * 4, ease: Power1.easeOut,
				onComplete: () => {
					this.shape.remove();
				}
			});
	}
}