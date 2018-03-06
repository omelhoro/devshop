import * as React from 'react';
import NavBar from './layout-components/navbar';

export default class Layout extends React.Component<{ children: any[] }, {}> {

	render() {
		return (
			<div>
				<NavBar />
				<div style={{
					margin: '0px auto',
					display: 'block',
					width: '1024px',
					paddingTop: '30px',
				}}
				>

					{this.props.children}
				</div>
			</div>
		);
	}
}
