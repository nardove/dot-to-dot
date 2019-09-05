import React, {Component, Fragment} from 'react';
import Header from './Header';
import Sketch from './Sketch';
import PathControls from './PathControls';
import {ViewProvider, ViewContext} from './ViewContext';


export default class MainView extends Component {
	render() {
		return(
			<Fragment>
				<canvas id='paper-canvas' resize='true' />

				<ViewProvider>
					<ViewContext.Consumer>
						{({
							isAddDotsEnabled,
							isEraseDotsEnabled,
							isPathVisible,
							toogleIsAddDotsEnabled,
							toogleIsEraseDotsEnabled,
							tooglePathVisible
						}) => (
							<Fragment>
								<Sketch
									isAddDotsEnabled={isAddDotsEnabled}
									isEraseDotsEnabled={isEraseDotsEnabled}
									isPathVisible={isPathVisible}
								/>
								<PathControls
									toogleIsAddDotsEnabled={toogleIsAddDotsEnabled}
									toogleIsEraseDotsEnabled={toogleIsEraseDotsEnabled}
									tooglePathVisible={tooglePathVisible}
								/>
							</Fragment>
						)}
					</ViewContext.Consumer>
				</ViewProvider>
				
				<Header />
			</Fragment>
		);
	}
}