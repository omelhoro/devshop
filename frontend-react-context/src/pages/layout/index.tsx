import * as React from 'react';
import NavBar from './navbar';

export default ({ children }) =>
	(<div>
		<NavBar />
		<div style={{
			margin: '0px auto',
			display: 'block',
			width: '1024px',
			paddingTop: '30px',
		}}
		>
			{children}
		</div>
	</div>);
