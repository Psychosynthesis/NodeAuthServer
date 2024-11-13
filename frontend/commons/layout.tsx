import { useEffect } from 'react';
import { Outlet } from "react-router-dom";
import { Button } from 'teleui';

// import Languages from '@Commn/localization';
import { useAPI } from '@API';
import { useCommonStore } from '@Store'
import { SESSION_LIFETIME_MS } from '@Config';

const redirectToLogin = () => { window.location.replace("/login") };

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
    const sessionStart = +window.localStorage.getItem('session');
    const currentDate = new Date().getTime();
    if (!sessionStart || (currentDate - sessionStart) > SESSION_LIFETIME_MS) {
      // Здесь мы окажемся, только в случае, если сессия ранее не была начата или уже истекла
      redirectToLogin();
    } else {
      // Сессия должна быть жива
      API.updateToken().then(res => {
        // Пытаемся обновить токен доступа, если работает, значит юзер уже залогинен, запоминаем токен в памяти
        if (res.error === false) {
          window.localStorage.setItem('session', String(new Date().getTime()));
          dispatch({ type: 'setToken', load: res.data?.token });
        } else { // В ином случае редиректимся, что-то не так с куками
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
        } else { // Не удалось получить данные пользователя
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
