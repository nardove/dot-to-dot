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
import TimelineIcon from '@material-ui/icons/Timeline';
import { HuePicker } from 'react-color';



export default class SketchControls extends Component {
	constructor(props) {
		super(props);

		this.state = {
			addBtnState: true,
			eraseBtnState: false,
			showPalette: false
		}

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
					<IconButton
						onClick={this.handleUndoDot}
					>
						<UndoIcon />
					</IconButton>
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
						label='Preview line'
						labelPlacement='start' />
				</Tooltip>

				<Tooltip title='Change dots colour' aria-label='Change dots colour'>
					<IconButton
						style={{ marginLeft: '20px' }}
						ref={el => (this.colourBtnRef = el)}
						onClick={this.handleClick}
					>
						<ColorLensIcon />
					</IconButton>
				</Tooltip>

				{
					this.state.showPalette &&
					<div className='colour-picker' onMouseLeave={this.toggleColourPanel}>
						<HuePicker color={this.props.currentColour} onChange={this.handleColourChange} />
					</div>
				}

				<Tooltip title='Delete all dots' aria-label='Delete all dots'>
					<IconButton
						ref={el => (this.trashBtnRef = el)}
						onClick={this.handleClick}
					>
						<DeleteIcon />
					</IconButton>
				</Tooltip>
			</Fragment>
		);
	}
}
