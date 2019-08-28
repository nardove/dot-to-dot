import React, {Component} from 'react';
import Sketch from './Sketch';

export default class MainView extends Component {

	componentDidMount() {
		// ßconst canvas = document.getElementById('paper-canvas');
	}

	render() {
		return(
			<div>
			<div id='render-container'>
				<canvas id='matter-canvas' resize='true' />
			</div>
				<canvas id='paper-canvas' resize='true' />
				<Sketch />
				<h1>Main View</h1>
			</div>
		);
	}
}