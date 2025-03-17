import './index.css';

import { persistedStore, store } from '@redux/store.ts';
import { ConfigProvider } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { PersistGate } from 'redux-persist/integration/react';

import App from './App.tsx';

// antd theme setups
const themeSetup = { token: { colorPrimary: '#ec1f24' } };

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.Fragment>
      <BrowserRouter>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistedStore}>
            <ConfigProvider theme={themeSetup}>
              <App />
            </ConfigProvider>
          </PersistGate>
        </Provider>
      </BrowserRouter>
  </React.Fragment>,
);
