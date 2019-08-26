import React, {Component} from 'react';
import image from '../assets/image.jpg';

class App extends Component {
	render() {
		return (
			<div>
				<h1>Hello!</h1>
				<img className='image' src={image} />
			</div>
		);
	}
}

export default App;