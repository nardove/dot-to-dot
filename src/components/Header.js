import React, { Component } from 'react';
import appIcon from '../assets/dot-to-dot-icon.svg';
import Typography from '@material-ui/core/Typography';

const th1 = {
	fontFamily: 'Quicksand',
	textAlign: 'left',
	fontSize: '2.5rem'
}

const th2 = {
	fontFamily: 'Quicksand',
	textAlign: 'left',
	fontSize: '1.25rem'
}

export default class Header extends Component {
	render() {
		return (
			// <div className='header'>
			<div className='header-wrapper'>
				<div className='header-wrapper-logo'>
					<img id='app-logo' className='app-logo' src={appIcon} alt='App Logo' title='App Logo' />
				</div>
				<div className='header-wrapper-title'>
					<Typography variant='h1' style={th1}>
						dot-to-dot
						</Typography>
					<Typography variant='h2' style={th2}>
						Create and share your own dot to dot puzzles
						</Typography>
				</div>
			</div>
			// </div>
		);
	}
}