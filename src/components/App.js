import React, {Component, Fragment} from 'react';
import Header from './Header';
import Sketch from './Sketch';


export default class App extends Component {
	render() {
		return (
			<Fragment>
				<Sketch	/>
				<Header />
			</Fragment>
		);
	}
}