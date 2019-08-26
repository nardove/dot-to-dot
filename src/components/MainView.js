import React, {Component} from 'react';
import Sketch from './Sketch';

export default class MainView extends Component {

	componentDidMount() {
		const canvas = document.getElementById('paper-canvas');
	}

	render() {
		return(
			<div>
				<canvas id='paper-canvas' resize='true' />
				<Sketch />
				<h1>Main View</h1>
			</div>
		);
	}
}