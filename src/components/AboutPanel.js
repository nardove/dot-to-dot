import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import GitHubIcon from '@material-ui/icons/GitHub';
import Link from '@material-ui/core/Link';



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
		console.log('close about panel');
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
						<Typography>
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
			// <Card>
			// 	<CardContent>
			// 		<Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
			// 			Thank you for using the app, hope you enjoy it.
			// 			I've create this app as a way to learn Reactjs, is still a work in progress,
			// 			I'll try to update and add new functionallity as soon as I can.
			// 		</Typography>

			// 		<Typography variant='h5'>
			// 			Legend
			// 		</Typography>

			// 		<Grid container direction='column' justify='space-evenly' alignItems='center'>
			// 			<Grid item style={legendItem}>
			// 				<AddCircleOutlineIcon style={iconItem} />
			// 				<Typography variant='subtitle2'>Add dot</Typography>
			// 			</Grid>
			// 			<Grid item style={legendItem}>
			// 				<RemoveCircleOutlineIcon style={iconItem} />
			// 				<Typography variant='subtitle2'>Remove dot</Typography>
			// 			</Grid>
			// 			<Grid item style={legendItem}>
			// 				<UndoIcon style={iconItem} />
			// 				<Typography variant='subtitle2'>Undo last added dot</Typography>
			// 			</Grid>
			// 			<Grid item style={legendItem}>
			// 				<ColorLensIcon style={iconItem} />
			// 				<Typography variant='subtitle2'>Change dot tint colour</Typography>
			// 			</Grid>
			// 			<Grid item style={legendItem}>
			// 				<AddPhotoAlternateIcon style={iconItem} />
			// 				<Typography variant='subtitle2'>Load image/photo reference</Typography>
			// 			</Grid>
			// 			<Grid item style={legendItem}>
			// 				<TuneIcon style={iconItem} />
			// 				<Typography variant='subtitle2'>Reference image settings</Typography>
			// 			</Grid>
			// 			<Grid item style={legendItem}>
			// 				<GetAppIcon style={iconItem} />
			// 				<Typography variant='subtitle2'>Download drawing</Typography>
			// 			</Grid>
			// 		</Grid>
			// 	</CardContent>

			// 	<CardActions>
			// 		<Button size="small" onClick={this.handleClose}>Close</Button>
			// 	</CardActions>
			// </Card>
		);
	}
}