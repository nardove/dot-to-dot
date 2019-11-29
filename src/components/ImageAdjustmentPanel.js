import React, { Component } from 'react';

export default class ImageAdjustmentPanel extends Component {
	constructor(props) {
		super(props);

		this.updateRange = this.updateRange.bind(this);
	}

	updateRange(event) {
		const slider = {
			type: event.target.id,
			value: event.target.value
		};
		this.props.adjustImage(slider);
	}

	render() {
		return (
			<div className='io-panel'>
				<label htmlFor='opacity'>Image opacity</label>
				<input id='opacity' name='opacity' type='range' min='0' max='0.7' step='0.01' defaultValue='0.1' onChange={this.updateRange} />
				<label htmlFor='scale'>Image scale</label>
				<input id='scale' name='scale' type='range' min='0.1' max='2' step='0.1' defaultValue='1' onChange={this.updateRange} />
			</div>
		);
	}
}