import * as React from 'react';
import { NavLink } from 'react-router-dom';

export default props => (
	<nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#e3f2fd' }}>
		<button
			className="navbar-toggler" type="button"
			data-toggle="collapse" data-target="#navbarText"
			aria-controls="navbarText" aria-expanded="false"
			aria-label="Toggle navigation"
		>
			<span className="navbar-toggler-icon"></span>
		</button>
		<div className="collapse navbar-collapse" id="navbarText">
			<ul
				className="navbar-nav" style={{
					margin: '0px auto',
					fontSize: 'xx-large',
				}}
			>
				<li className="nav-item">
					<NavLink className="nav-link" to="/" exact>
						<i className="material-icons md-24">home</i>
						Home
					</NavLink>
				</li>

				<li className="nav-item">
					<NavLink className="nav-link" to="/shopping">
						<i className="material-icons md-24">shop</i>
						Shop
					</NavLink>
				</li>

			</ul>
		</div>

	</nav>
);
