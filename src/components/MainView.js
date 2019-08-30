import React, {Component, Fragment} from 'react';
import Sketch from './Sketch';

export default class MainView extends Component {

	componentDidMount() {
		// ßconst canvas = document.getElementById('paper-canvas');
	}

	render() {
		return(
			<Fragment>
				<Sketch />
				<h1>Main View</h1>
			</Fragment>
		);
	}
}