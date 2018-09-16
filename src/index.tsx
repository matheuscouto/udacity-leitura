import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

// CSS IMPORTS
import './styles/main.css';

import store from './store'

import * as moment from 'moment';
import 'moment/locale/pt-br';

moment.locale('pt-BR');

ReactDOM.render(
	<Provider store={store}>
		<Router>
			<App />
		</Router>
	</Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
