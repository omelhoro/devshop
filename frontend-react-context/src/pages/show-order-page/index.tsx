import * as React from 'react';
import urlJoin from 'url-join';
import * as vars from '../../utils/vars';
import qS from 'query-string';
import * as moment from 'moment';
import OrderElement from './order-element';
import { Fetch } from 'react-request';

export default () => (
	<Fetch
		url={urlJoin(vars.BACKEND_ENDPOINT, '/api/orders', qS.parse(location.search).token)}>
		{({ data: order }) => {
			if (!order) { return <div>Loading</div>; }
			return (
				<div>
					<h2>
						Your order from
						{' '}
						<i>
							{moment(order.timestamp).format('HH:mm DD-MM-YYYY')}
						</i>
						{' '}
						with a total value of <i>{order.sum}$</i>
					</h2>
					{(order.cart).map((developer) => (
						<OrderElement
							key={`${developer.login}`}
							developer={developer}
						/>
					))}
				</div>
			);
		}}
	</Fetch>
);
