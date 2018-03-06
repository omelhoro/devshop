import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { style } from 'typestyle';

const navbarStyle = style({
	margin: '0px auto',
	fontSize: 'xx-large',
});

const iconStyle = style({
	position: 'relative',
	top: '6px',
	right: '5px',
});

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
				className={`navbar-nav ${navbarStyle}`}
			>
				<li className="nav-item">
					<NavLink className="nav-link" to="/" exact>
						<i className={`material-icons md-36 ${iconStyle}`}>home</i>
						Home
					</NavLink>
				</li>

				<li className="nav-item">
					<NavLink className="nav-link" to="/shopping">
						<i className={`material-icons md-36 ${iconStyle}`}>shop</i>
						<span>
							Shop
						</span>
					</NavLink>
				</li>

			</ul>
		</div>

	</nav>
);
