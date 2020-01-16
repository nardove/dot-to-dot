import React, { Component, Fragment } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Tooltip from '@material-ui/core/Tooltip';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ColorLensIcon from '@material-ui/icons/ColorLens';
import UndoIcon from '@material-ui/icons/Undo';
import DeleteIcon from '@material-ui/icons/Delete';
import { HuePicker } from 'react-color';
import Typography from '@material-ui/core/Typography';


const th1 = {
	fontFamily: 'Quicksand',
	fontSize: '1rem'
}


export default class SketchControls extends Component {
	constructor(props) {
		super(props);

		this.state = {
			addBtnState: true,
			eraseBtnState: false,
			showPalette: false
		}

		this.colourPickerButtonPositionX = 0;

		this.toggleAddDot = this.toggleAddDot.bind(this);
		this.toggleEraseDot = this.toggleEraseDot.bind(this);
		this.togglePathVisiblility = this.togglePathVisiblility.bind(this);
		this.handleUndoDot = this.handleUndoDot.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleDeleteAllDots = this.handleDeleteAllDots.bind(this);
		this.toggleColourPanel = this.toggleColourPanel.bind(this);
		this.handleColourChange = this.handleColourChange.bind(this);

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
		this.setState({ showPalette: false });
	}

	handleClick(event) {
		switch (event.currentTarget) {
			case this.addBtnRef:
				this.setState({
					addBtnState: true,
					eraseBtnState: false
				});
				this.toggleAddDot();
				break;
			case this.eraseBtnRef:
				this.setState({
					addBtnState: false,
					eraseBtnState: true
				});
				this.toggleEraseDot();
				break;
			case this.pathBtnRef:
				this.togglePathVisiblility();
				break;
			case this.colourBtnRef:
				const parent = document.getElementById('wrapper');
				const style = window.getComputedStyle(parent, null);
				const offset = (event.clientX - parseInt(style.marginLeft)) - 170;
				this.colourPickerButtonPositionX = offset.toString() + 'px';

				this.setState({
					showPalette: true
				});
				break;
			case this.trashBtnRef:
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

	handleColourChange(colour, event) {
		this.props.handleColourChange(colour.hsl);
	}

	render() {
		return (
			// <div className='sketch-controls'>
			<Fragment>
				<Tooltip title='Add dot' aria-label='Add dot'>
					<span>
						<IconButton
							disabled={this.state.addBtnState}
							ref={el => (this.addBtnRef = el)}
							onClick={this.handleClick}
						>
							<AddCircleOutlineIcon />
						</IconButton>
					</span>
				</Tooltip>

				<Tooltip title='Erase dot' aria-label='Erase dot'>
					<span>
						<IconButton
							disabled={this.state.eraseBtnState}
							ref={el => (this.eraseBtnRef = el)}
							onClick={this.handleClick}
						>
							<RemoveCircleOutlineIcon />
						</IconButton>
					</span>
				</Tooltip>

				<Tooltip title='Undo last added dot' aria-label='Undo last added dot'>
					<span>
						<IconButton
							onClick={this.handleUndoDot}
						>
							<UndoIcon />
						</IconButton>
					</span>
				</Tooltip>

				<Tooltip title='Show/hide connecting line' aria-label='Show/hide connecting line'>
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
						label={<Typography style={th1}>Preview line</Typography>}
						labelPlacement='start' />
				</Tooltip>

				<Tooltip title='Change dots colour' aria-label='Change dots colour'>
					<span style={{ marginLeft: '20px' }}>
						<IconButton
							ref={el => (this.colourBtnRef = el)}
							onClick={this.handleClick}
						>
							<ColorLensIcon />
						</IconButton>
					</span>
				</Tooltip>

				{
					this.state.showPalette &&
					<div className='colour-picker' style={{ marginLeft: this.colourPickerButtonPositionX }} onMouseLeave={this.toggleColourPanel}>
						<HuePicker color={this.props.currentColour} onChange={this.handleColourChange} />
					</div>
				}

				<Tooltip title='Delete all dots' aria-label='Delete all dots'>
					<span>
						<IconButton
							ref={el => (this.trashBtnRef = el)}
							onClick={this.handleClick}
						>
							<DeleteIcon />
						</IconButton>
					</span>
				</Tooltip>
			</Fragment>
			// </div>
		);
	}
}
