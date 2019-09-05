import React, {Component, createContext} from 'react';

export const ViewContext = createContext();

export class ViewProvider extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isPathVisible: false,
			isAddDotsEnabled: true,
			isEraseDotsEnabled: false
		};
	}
	
	tooglePathVisible = () => {
		this.setState({
			isPathVisible: !this.state.isPathVisible
		});
		console.log("toogle path visible:", this.state.isPathVisible);
	}

	toogleIsAddDotsEnabled = () => {
		this.setState({
			isAddDotsEnabled: true,
			isEraseDotsEnabled: false
		});
		console.log("toogle add dots:", this.state.isAddDotsEnabled);
	}

	toogleIsEraseDotsEnabled = () => {
		this.setState({
			isAddDotsEnabled: false,
			isEraseDotsEnabled: true
		});
		console.log("toogle erase dots:", this.state.isEraseDotsEnabled);
	}

	render() {
		return(
			<ViewContext.Provider value={{
				// ...this.state,
				isAddDotsEnabled: this.state.isAddDotsEnabled,
				isEraseDotsEnabled: this.state.isEraseDotsEnabled,
				isPathVisible: this.state.isPathVisible,
				toogleIsAddDotsEnabled: this.toogleIsAddDotsEnabled,
				toogleIsEraseDotsEnabled: this.toogleIsEraseDotsEnabled,
				tooglePathVisible: this.tooglePathVisible
			}}>
				{this.props.children}
			</ViewContext.Provider>
		);
	}
}
