
export default class Dot {
	constructor(id, position, color) {
		this.id = new PointText({
			content: id,
			justification: 'center',
			fontSize: 10,
			fontWeight: 'bold',
			fillColor: color,
			position: position.subtract(7)
		});
		
		this.position = position;
		this.color = color;
		this.dotSize = 5;
		
		this.shape = new Shape.Circle({
					position: position,
					radius: 3,
					fillColor: color
				});
	}

	render() {
		// this.id.position = this.position.subtract(7);
		// this.line.segments[0].point = this.constraint.pointA;
		// this.line.segments[1].point = this.body.position;
	}
}