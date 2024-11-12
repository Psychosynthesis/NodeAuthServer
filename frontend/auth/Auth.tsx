import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import { Tabs } from 'teleui';
import { AppStoreProvider } from '@Store';

import { Register } from './Register';
import { Login } from './Login';

import '@Commn/styles.scss';
import './style.scss';

const container = document.getElementById('main-node');

export const Auth = () => {
  const tabIndex = window.location.href.includes('login') ? 0 : 1;

  return (
    <div className="auth-form main-layout">
      <h2 style={{ textAlign: 'center' }}>Auth</h2>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <Tabs defaultIndex={tabIndex}
            tabs={[
              { caption: 'Login', content: <Login /> },
              { caption: 'Register', content: <Register /> },
            ]}
          />
      </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(container!).render(
    <React.StrictMode>
      <AppStoreProvider>
        <Auth />
      </AppStoreProvider>
    </React.StrictMode>,
)
