import React from 'react';
import ReactDOM from 'react-dom';
import Chat from './Chat';
import './index.scss';

const docBotElement = document.getElementById('bsf-docs-bot-app');
if ( docBotElement ) {
	ReactDOM.render(
		<React.StrictMode>
			<Chat/>
		</React.StrictMode>,
		docBotElement
	);
}
