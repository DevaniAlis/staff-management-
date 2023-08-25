import { render } from 'react-dom';

// third party
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import React from "react";

// project imports
import * as serviceWorker from 'serviceWorker';
import App from 'App';
import { store } from 'store';

// style + assets
import 'assets/scss/style.scss';
import config from './config';

// ==============================|| REACT DOM RENDER  ||============================== //

const root =  document.getElementById('root');
render(
  <Provider store={store}>
    <HashRouter basename={config.basename}>
      <App />
    </HashRouter>
  </Provider>
, root);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
