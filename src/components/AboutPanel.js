import React, { Component } from 'react';

export default class AboutPanel extends Component {
	constructor(props) {
		super(props);

		this.closePanel = this.closePanel.bind(this);
	}

	closePanel() {
		console.log('close panel');
		this.props.closePanel();
	}

	render() {
		return (
			<div>
				<p className='about-paragraph'>
					Thank you for using the app, hope you enjoy it.<br />
					I've create this app as a way to learn Reactjs. is still a work in progress,
					I'll try to update and add new functionallity as soon as I can.
				</p>

				<div className='d-flex justify-content-center'>
					<button className='close-btn' onClick={this.closePanel}>Close X</button>
				</div>
			</div >
		);
	}
}