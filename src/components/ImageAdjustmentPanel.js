import React, {
	Component,
	Fragment
} from 'react';

export default class ImageAdjustmentPanel extends Component {
	constructor(props) {
		super(props);

		this.updateRange = this.updateRange.bind(this);
	}

	updateRange(event) {
		console.log(event.target.id);
		const slider = {
			type: event.target.id,
			value: event.target.value
		};
		this.props.adjustImage(slider);
	}

	render() {
		return (
			<div className='io-panel'>
				<p>Image opacity</p>
				<input id='opacity' type='range' min='0' max='0.7' step='0.01' defaultValue='0.5' onChange={this.updateRange} />
				<p>Image scale</p>
				<input id='scale' type='range' min='0' max='5' step='0.01' defaultValue='0.5' onChange={this.updateRange} />
			</div>
		);
	}
}