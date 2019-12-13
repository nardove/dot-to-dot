import gsap from 'gsap';
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

		gsap.fromTo(this.shape, 0.25,
			{
				opacity: 0.5,
				radius: this.dotSize * 4
			},
			{
				opacity: 1,
				radius: this.dotSize,
				ease: 'power1.out'
			});
	}

	remove(doDelay = false) {
		const wait = this.id.content;
		this.id.remove();
		gsap.to(this.shape, (doDelay) ? wait * 0.02 : 0.2,
			{
				opacity: 0.2,
				radius: this.dotSize * 4,
				ease: 'power4.inOut',
				delay: (doDelay) ? wait * 0.01 : 0,
				onComplete: () => {
					this.shape.remove();
				}
			});
	}
}