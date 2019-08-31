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
				<h1>dot&#8212;to&#8212;dot</h1>
				{/* <h2>&#8226;&#8212;&#8226;&#8212;&#8226;</h2> */}
				<h3>web application to create your own dot-to-dot drawings</h3>
			</Fragment>
		);
	}
}