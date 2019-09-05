import React from 'react';
import appIcon from '../assets/dot-to-dot-icon.svg';


const Header = () => {
	return(
		<div className='header container-fluid'>
			<div className='row justify-content-start'>
				<div className='col-1'>
					<img src={appIcon} alt='App Logo' title='App Logo' />
				</div>
				<div className='col-11 text-left'>	
					<h1>dot&#8212;to&#8212;dot</h1>
					<h5>Create and share your own dot-to-dot drawings</h5>
				</div>
			</div>
		</div>
	);
}

export default Header;