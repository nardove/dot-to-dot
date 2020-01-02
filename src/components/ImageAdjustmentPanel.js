import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const slider = {
	color: '#000000'
}

const spacing = {
	paddingTop: '10px'
}

export default class ImageAdjustmentPanel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: true,
			opacity: this.props.imageOpacity,
			scale: this.props.imageScale
		};

		this.updateRange = this.updateRange.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	updateRange = name => (event, value) => {
		const slider = {
			type: name,
			value: value
		};
		this.props.adjustImage(slider);
	}

	handleClose() {
		this.props.handleClose();
		this.setState({ open: false });
	}

	handleShowRasterImage() {
		this.props.handleShowRasterImage();
	}

	render() {
		return (
			<div className='io-panel' onMouseLeave={this.handleClose}>
				<Card>
					<CardContent>
						<Typography variant='button' display='block'>
							Image adjustment
						</Typography>

						<Typography style={spacing}>
							Scale
						</Typography>
						<Slider
							min={0.1}
							max={2}
							step={0.1}
							defaultValue={this.props.imageScale}
							style={slider}
							onChange={this.updateRange('scale')}
							onChangeCommitted={this.updateRange('scale')}
						/>

						<Typography style={spacing}>
							Opacity
						</Typography>
						<Slider
							min={0}
							max={0.8}
							step={0.01}
							defaultValue={this.props.imageOpacity}
							style={slider}
							onChange={this.updateRange('opacity')}
							onChangeCommitted={this.updateRange('opacity')}
						/>
					</CardContent>
				</Card>
			</div>
		);
	}
}