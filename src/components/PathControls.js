import React from 'react';
import pencilIcon from '../assets/gui-icons/glyphicons-basic-31-pencil.svg';
import eraserIcon from '../assets/gui-icons/glyphicons-basic-250-eraser.svg';
import pathLineIcon from '../assets/gui-icons/glyphicons-basic-98-vector-path-line.svg';
import paletteIcon from '../assets/gui-icons/glyphicons-basic-248-palette.svg';
import textIcon from '../assets/gui-icons/glyphicons-basic-101-text.svg';


export default function PathControls(props) {
	
	return(
		<div className='path-line-controls container fixed-bottom'>
				<img src={pencilIcon} alt='Add dot' title='Add dot' onClick={props.toogleIsAddDotsEnabled} />
				<img src={eraserIcon} alt='Erase dot' title='Erase dot' onClick={props.toogleIsEraseDotsEnabled} />
				<img src={pathLineIcon} alt='Show/Hide path line' title='Show/Hide path line' onClick={props.tooglePathVisible} />
				<img src={paletteIcon} alt='Dots color options' title='Dots color options' />
				<img src={textIcon} alt='Add text' title='Add text' />
			
		</div>
	);
}
