import React from 'react';
import PropType from 'prop-types';

import './App.scss';

export default class App extends React.Component {
	render() {
		const children = this.props.children;
		return (
			<div className="container">
				<p className="hello">{children}</p>
			</div>
		);
	}

	static propTypes = {
		children: PropType.node
	}
}
