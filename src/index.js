/* eslint-disable no-unused-vars */
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
/* eslint-enable no-unused-vars */

import React from 'react';
import ReactDomClient from 'react-dom/client';
import ReactLibrary from 'react-library';

import App from './components/App';

console.log('/* @echo ENV */');

ReactDomClient
	.createRoot(document.getElementById('app'))
	.render(
		<>
			<App>Hello World</App>
			<ReactLibrary>Hello Universe</ReactLibrary>
		</>
	);
