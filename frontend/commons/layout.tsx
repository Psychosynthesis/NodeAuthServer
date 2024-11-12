import { useEffect } from 'react';
import { Outlet } from "react-router-dom";
import { getCookie } from 'vanicom';

// import Languages from '@Commn/localization';
import { useAPI } from '@API';
import { useCommonStore } from '@Store'

export const BasicLayout = () => {
  const API = useAPI();
  const [ state, dispatch ] = useCommonStore();
  const { token } = state;

  useEffect(() => {
    const hash = getCookie('hash');
    console.log('hash is: ', hash);
    if (!hash) {
      window.location.replace("/login");
    } else {
      API.updateToken().then(res => {
        if (res.error === false) {
          console.log('ТОКЕН ОБНОВЛЁН: ', res.data)
          dispatch({ type: 'setToken', load: res.data?.token });
        } else {
          window.location.href = '/login';
          // window.location.reload();
        }
      });
    }
  }, []);

  useEffect(() => {
    if (token) {
      console.log('token is: ', token);
      API.getUser().then(res => {
        console.log('res is: ', res)
        if (res.error === false) {
          dispatch({ type: 'setUserData', load: res.data?.user })
        } else {
          console.error(res.message);
        }
      });
    }
  }, [token]);

  return (
    <div className="main-layout">
      {state?.user &&
        <div>
          User: { state.user.username }
        </div>
      }
      <Outlet />
    </div>
  );
}
