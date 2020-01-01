import React, { Component, Fragment, Suspense } from 'react';
import PreloaderLoop from './PreloaderLoop';
// import Sketch from './Sketch';
const Sketch = React.lazy(() => import('./Sketch'));

export default class App extends Component {
	render() {
		return (
			<Fragment>
				<Suspense fallback={
					<div className='preloader'>
						<PreloaderLoop />
						<div>Loading</div>
					</div>
				}>
					<Sketch />
				</Suspense>
			</Fragment>
		);
	}
}