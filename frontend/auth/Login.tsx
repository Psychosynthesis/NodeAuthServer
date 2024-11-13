import { useState } from 'react';
import { Button, SimpleInput } from 'teleui';

import { useAPI } from '@API';
import { USERNAME_LENGTH } from '@Config';

export const Login = () => {
    const API = useAPI();
    const [username, setName] = useState('');
    const [pass, setPass] = useState('');
    const [loginErrors, setError] = useState(null);

    const validateName = (username: string) => {
      if (username.length > USERNAME_LENGTH) return;
      setName(username.toLowerCase());
    }

    const onLogin = () => {
      setError(null);
      API.login({ username, pass }).then(loginResponse => {
        if (loginResponse?.error === false) {
          window.localStorage.setItem('session', String(new Date().getTime()));
          setError('Вы будете перенаправлены. Если перенаправление не работает, перейдите на адрес /list');
          setTimeout(() => { window.location.replace("/list"); }, 1000); // Чтобы успеть обновить рефреш на гет-запросе
        } else {
          setError(loginResponse?.message ?? 'Неизвестная ошибка');
        }
      })
    };

    return (
      <div>
        <SimpleInput value={username} valueSetter={validateName} placeholder="Минимум 4 символа" label="Nickname" borderColor="#ffffff" />
        <br />
        <SimpleInput value={pass} valueSetter={setPass} placeholder="Password" label="Password" borderColor="#ffffff" />
        <br />
        {loginErrors &&
          <div className="errors">{loginErrors}</div>
        }
        <div className="control-row">
          <Button onClick={onLogin}>Login</Button>
        </div>
      </div>
    );
}
