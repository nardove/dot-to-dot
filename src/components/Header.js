import React, { Component } from 'react';
import appIcon from '../assets/dot-to-dot-icon.svg';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const typoClass = {
	fontFamily: 'Quicksand',
	textAlign: 'left'
}


export default class Header extends Component {
	render() {
		return (
			<Grid container direction='row' justify='flex-start' alignItems='flex-start'>
				<Grid item>
					<img className='app-logo' src={appIcon} alt='App Logo' title='App Logo' />
				</Grid>
				<Grid item>
					<Typography variant='h4' style={typoClass}>
						dot-to-dot
					</Typography>
					<Typography variant='h6' style={typoClass}>
						Create and share your own dot to dot puzzles
					</Typography>
				</Grid>
			</Grid>
		);
	}
}