import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Tabs } from 'teleui';

import { useAPI } from '@API';
import { AppStoreProvider } from '@Store';

import { Register } from './Register';
import { Login } from './Login';

import '@Commn/styles.scss';
import './style.scss';

const container = document.getElementById('main-node');

export const Auth = () => {
  const API = useAPI();
  const tabIndex = window.location.href.includes('login') ? 0 : 1;

  useEffect(() => {
    const sessionStart = +window.localStorage.getItem('session');
    if (!sessionStart) { // Если ранее не запоминали старт сессии, то можно не долбиться в АПИ
      API.updateToken().then(res => { // Пытаемся обновить токен доступа, если работает, значит юзер уже залогинен
        window.localStorage.setItem('session', String(new Date().getTime()));
        if (!import.meta.env.DEV) { // Только для прода, так как Auth включена в код на деве и будет кольцевой редирект
          if (res.error === false) {
            window.location.replace("/list");
          }
        }
      })
    }
  }, []);

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
createRoot(container!).render(
  <StrictMode>
    <AppStoreProvider>
      <Auth />
    </AppStoreProvider>
  </StrictMode>,
)
