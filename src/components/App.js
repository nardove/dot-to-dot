import React, { Component, Fragment, Suspense } from 'react';
import PreloaderLoop from './PreloaderLoop';
import MediaQuery from 'react-responsive';
import WarningIcon from '@material-ui/icons/Warning';

const Sketch = React.lazy(() => import('./Sketch'));


export default class App extends Component {
	render() {
		return (
			<Suspense fallback={
				<div className='preloader'>
					<PreloaderLoop />
					<div>Loading</div>
				</div>
			}>
				<MediaQuery minDeviceWidth={1030}>
					<Sketch />
				</MediaQuery>

				<MediaQuery maxDeviceWidth={1024}>
					<div className='preloader'>
						<p>
							<WarningIcon fontSize='large' /><br /><br />
							It looks like you are visiting from a table or mobile device.<br /><br />
							At the moment this app is not optimized to work on mobile devices, but on desktops only.<br /><br />
							Mobile devices support will be added in the future.
						</p>
					</div>
				</MediaQuery>
			</Suspense>
		);
	}
}