import * as React from 'react';
import * as moment from 'moment';

export default ({ element, removeFromCart }) => (
	<li
		key={`shoppingcart-${element.login}`}
		className="list-group-item d-flex justify-content-between align-items-center"
	>
		<div>
			{element.login}
			{' '}
			({element.appAdded.totalSum}$)
			<br />
			<small>
				Added on {moment(element.addedToCart).format('HH:mm DD.MM.YY')}
			</small>
		</div>
		<span
			className="badge badge-warning badge-pill"
			style={{
				cursor: 'pointer',
			}}
			onClick={removeFromCart}
		>
			<i className="material-icons">close</i>
		</span>

	</li>
);
