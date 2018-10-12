import * as React from 'react';
import * as _ from 'lodash';
import SearchPanel from './organisms/search-panel';
import ConfirmModal from './organisms/confirm-modal';
import DevList from './organisms/dev-list';
import CartPanel from './organisms/cart-panel';

export default () => (
	<div className="">
		<ConfirmModal />
		<div className="col-sm-8">
			<SearchPanel
			/>
		</div>

		<div className="row">

			<div className="col-sm-8">
				<DevList />
			</div>

			<div className="col-sm-4">
				<CartPanel />
			</div>

		</div>
	</div>
);
