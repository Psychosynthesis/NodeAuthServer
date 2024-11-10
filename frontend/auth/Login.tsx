import { useState } from 'react';
import { Button, SimpleInput } from 'teleui';
import { setCookie } from 'vanicom';

import { useAPI } from '@API';

export const Login = () => {
    const API = useAPI();
    const [username, setName] = useState('');
    const [pass, setPass] = useState('');
    const [loginErrors, setError] = useState(null);

    const onLogin = () => {
      setError(null);
      API.login({ username, pass }).then(res => {
        if (!res.error) {
          setCookie('hash', res.data.token, 36000);
          setError('Вы будете перенаправлены. Если перенаправление не работает, перейдите на адрес /list');
          window.location.replace("/list");
        } else {
          setError(res.message);
        }
      });
    };

    return (
      <div>
        <SimpleInput value={username} valueSetter={setName} placeholder="Минимум 4 символа" label="Nickname" borderColor="#ffffff" />
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
