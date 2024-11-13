import { useEffect } from 'react';
import { Outlet } from "react-router-dom";
import { Button } from 'teleui';
import { getCookie } from 'vanicom';

// import Languages from '@Commn/localization';
import { useAPI } from '@API';
import { useCommonStore } from '@Store'

const redirectToLogin = () => window.location.replace("/login");

export const BasicLayout = () => {
  const API = useAPI();
  const [ state, dispatch ] = useCommonStore();
  const { token } = state;

  const logoutHandler = () => {
    API.logout().then(response => {
      if (response.error === false) {
        dispatch({ type: 'clearUserData' });
        dispatch({ type: 'setToken', load: '' });
        redirectToLogin();
      }
    })
  }

  useEffect(() => {
    const hash = getCookie('hash');
    if (!hash) {
      redirectToLogin();
    } else {
      API.updateToken().then(res => {
        if (res.error === false) {
          dispatch({ type: 'setToken', load: res.data?.token });
        } else {
          redirectToLogin();
        }
      });
    }
  }, []);

  useEffect(() => {
    if (token) {
      API.getUser().then(res => {
        if (res.error === false) {
          dispatch({ type: 'setUserData', load: res.data?.user })
        } else {
          dispatch({ type: 'clearUserData' })
          dispatch({ type: 'setToken', load: '' })
          redirectToLogin();
        }
      });
    }
  }, [token]);

  return (
    <div className="main-layout">
      {state?.user &&
        <div className="header-row">
          <div>User: { state.user.username }</div>
          <div><Button onClick={logoutHandler}>Выйти</Button></div>
        </div>
      }
      <Outlet />
    </div>
  );
}
