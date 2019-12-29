import React, { Component } from 'react';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import gsap from 'gsap';

export default class PreloaderLoop extends Component {
	constructor(props) {
		super(props);
		this.iconRef = React.createRef();
	}

	componentDidMount() {
		gsap.to(this.iconRef, {
			duration: 2,
			opacity: 0
		});
	}

	render() {
		return (
			<div>
				<HourglassEmptyIcon ref={this.iconRef} />
			</div>
		);
	}
}