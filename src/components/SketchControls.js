import React, { Component, Fragment } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ColorLensIcon from '@material-ui/icons/ColorLens';
import UndoIcon from '@material-ui/icons/Undo';
import DeleteIcon from '@material-ui/icons/Delete';



export default class SketchControls extends Component {
	constructor(props) {
		super(props);

		this.state = {
			addBtnState: true,
			eraseBtnState: false
		}

		this.toggleAddDot = this.toggleAddDot.bind(this);
		this.toggleEraseDot = this.toggleEraseDot.bind(this);
		this.togglePathVisiblility = this.togglePathVisiblility.bind(this);
		this.handleUndoDot = this.handleUndoDot.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleDeleteAllDots = this.handleDeleteAllDots.bind(this);
		this.toggleColourPanel = this.toggleColourPanel.bind(this);
		
		this.addBtnRef = React.createRef();
		this.eraseBtnRef = React.createRef();
		this.undoBtnRef = React.createRef();
		this.pathBtnRef = React.createRef();
		this.paletteBtnRef = React.createRef();
		this.textBtnRef = React.createRef();
		this.trashBtnRef = React.createRef();
		this.colourBtnRef = React.createRef();
	}

	componentDidMount() { }

	toggleAddDot() {
		this.props.toggleAddDot();
	}

	toggleEraseDot() {
		this.props.toggleEraseDot();
	}

	handleUndoDot() {
		this.props.handleUndoDot();
	}

	togglePathVisiblility() {
		this.props.togglePathVisibility();
	}

	handleDeleteAllDots() {
		this.props.deleteAllDots();
	}

	toggleColourPanel() {
		this.props.toggleColourPanel();
	}


	handleClick(event) {
		// console.log(event.currentTarget, this.addBtnRef);
		switch (event.currentTarget) {
			case this.addBtnRef:
				console.log('add btn');
				this.setState({
					addBtnState: true,
					eraseBtnState: false
				});
				this.toggleAddDot();
				break;
			case this.eraseBtnRef:
				console.log('erase btn');
				this.setState({
					addBtnState: false,
					eraseBtnState: true
				});
				this.toggleEraseDot();
				break;
			case this.pathBtnRef:
				console.log('path btn');
				this.togglePathVisiblility();
				break;
			case this.colourBtnRef:
				console.log('colour btn');
				this.toggleColourPanel();
				break;
			case this.trashBtnRef:
				console.log('trash btn');
				this.setState({
					addBtnState: true,
					eraseBtnState: false
				});
				this.handleDeleteAllDots();
				break;
			default:
				console.log('other btn');
				break;
		}
	}

	render() {
		return (
			<Fragment>
				<IconButton
					disabled={this.state.addBtnState}
					ref={el => (this.addBtnRef = el)}
					onClick={this.handleClick}
				>
					<AddCircleOutlineIcon />
					{/* <div>Add dots</div> */}
				</IconButton>

				<IconButton
					disabled={this.state.eraseBtnState}
					ref={el => (this.eraseBtnRef = el)}
					onClick={this.handleClick}
				>
					<RemoveCircleOutlineIcon />
				</IconButton>

				<IconButton
					onClick={this.handleUndoDot}
				>
					<UndoIcon />
				</IconButton>

				<FormControlLabel
					control={
						<Switch
							size='small'
							value="checkedF"
							color="default"
							inputProps={{ 'aria-label': 'Show/hide line' }}
							onChange={this.togglePathVisiblility}
						/>
					}
					label='Show line'
					labelPlacement='start'/>

				<IconButton
					style={{ marginLeft: '20px' }}
					ref={el => (this.colourBtnRef = el)}
					onClick={this.handleClick}
				>
					<ColorLensIcon />
				</IconButton>

				<IconButton
					ref={el => (this.trashBtnRef = el)}
					onClick={this.handleClick}
				>
					<DeleteIcon />
				</IconButton>
			</Fragment>
		);
	}
}
