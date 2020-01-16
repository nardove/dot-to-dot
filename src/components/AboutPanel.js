import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import GitHubIcon from '@material-ui/icons/GitHub';
import Link from '@material-ui/core/Link';

const th1 = {
	fontFamily: 'Quicksand',
	fontSize: '2.5rem'
}

const legendItem = {
	display: 'flex',
	alignItems: 'center',
	width: '230px',
	marginBottom: '5px'
}
const iconItem = {
	marginRight: '10px'
}


export default class AboutPanel extends Component {
	constructor(props) {
		super(props);
		this.state = { open: true };
		this.handleClose = this.handleClose.bind(this);
	}


	handleClose() {
		this.props.handleClose();
		this.setState({ open: this.state.open = false });
	}

	render() {
		return (
			<Fragment>
				<Dialog
					open={this.state.open}
					onClose={this.handleClose}
					aria-labelledby="max-width-dialog-title"
				>
					<DialogTitle id="max-width-dialog-title">
						<Typography variant='h4' style={th1}>
							About
						</Typography>
					</DialogTitle>

					<DialogContent>
						<DialogContentText>
							Personal project that lets you create, download, print and share your own dot-to-dot drawings. I took this opportunity to learn how to use Reactjs and the new Javascript features, hope you enjoy it as much as I did creating it.
						</DialogContentText>
					</DialogContent>
					<DialogContent>
						<DialogContentText>
							It is available on Github if you want to help improving it.<br />
							<Link href='https://github.com/nardove/dot-to-dot' target='_blank' rel='noopener'>
								<GitHubIcon fontSize='large' style={{ color: 'black', margin: '10px' }} />
							</Link>
						</DialogContentText>
					</DialogContent>

					<DialogActions>
						<Button onClick={this.handleClose} style={{ color: '#000000' }}>
							Close
						</Button>
					</DialogActions>
				</Dialog>
			</Fragment>
		);
	}
}