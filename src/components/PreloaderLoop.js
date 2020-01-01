import React, { Fragment, Component } from 'react';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import gsap from 'gsap';


export default class PreloaderLoop extends Component {

	componentDidMount() {
		gsap.to(this.hourglass, {
			duration: 1,
			rotation: 180,
			repeat: -1,
			ease: 'Power1.easeInOut'
		});
	}

	componentWillUnmount() {
		gsap.killTweensOf(this.hourglass);
	}

	render() {
		return (
			<Fragment>
				<HourglassEmptyIcon ref={div => this.hourglass = div} />
			</Fragment>
		);
	}
}