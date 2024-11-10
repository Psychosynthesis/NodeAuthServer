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
        console.log('updateToken: ', res)
        if (res.error === false) {
          console.log('ТОКЕН ОБНОВЛЁН: ', res.data)
          dispatch({ type: 'setToken', load: res.data?.token });
        }
      });
    }
  }, []);

  useEffect(() => {
    console.log('token is: ', token);
    if (token) {
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
    <>
      {state?.user &&
        <div>
          User: { state.user.username }
        </div>
      }
      <Outlet />
    </>
  );
}
