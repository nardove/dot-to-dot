import React, {Component, Fragment} from 'react';
import Header from './Header';
import Sketch from './Sketch';
import SketchControls from './SketchControls';

export default class MainView extends Component {
	render() {
		return(
			<Fragment>
				{/* <canvas id='paper-canvas' resize='true' /> */}
				<Sketch	/>
				<SketchControls />
				<Header />
			</Fragment>
		);
	}
}
