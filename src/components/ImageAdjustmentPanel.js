import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';

const slider = {
	color: '#000000'
}

export default class ImageAdjustmentPanel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: true,
			opacity: 0.1,
			scale: 1
		};

		this.updateRange = this.updateRange.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	updateRange = name => (event, value) => {
		// console.log(name, value);
		const slider = {
			type: name,
			value: value
		};
		this.props.adjustImage(slider);
		if (name === 'opacity') {
			this.setState({ opacity: value });
		}
		else if (name === 'scale') {
			this.setState({ scale: value });
		}
	}

	handleClose() {
		console.log('close image adjustment panel');
		this.props.handleClose();
		this.setState({ open: this.state.open = false });
	}

	render() {
		return (
			<div onMouseLeave={this.handleClose}>
				<Card className='io-panel'>
					<CardContent>
						<Typography variant='button' display='block'>
							Image adjustment
						</Typography>

						<Typography>
							Opacity
						</Typography>
						<Slider
							min={0}
							max={0.8}
							step={0.01}
							defaultValue={this.state.opacity}
							style={slider}
							onChange={this.updateRange('opacity')}
						/>

						<Typography>
							Scale
						</Typography>
						<Slider
							min={0.1}
							max={2}
							step={0.1}
							defaultValue={this.state.scale}
							style={slider}
							onChange={this.updateRange('scale')}
						/>
					</CardContent>
				</Card>
			</div>
		);
	}
}