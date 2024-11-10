import { useState } from 'react';
import { Button, SimpleInput } from 'teleui';
import { useAPI } from '@API';

export const Register = () => {
    const API = useAPI();
    const [mail, setMail] = useState('');
    const [username, setName] = useState('');
    const [pass, setPass] = useState('');
    const [registerErr, setError] = useState(null);


    const onReg = () => {
      setError(null);
      API.register({ mail, username, pass }).then(response => {
        if (!response.error) {
          setError('Вы успешно зарегистрированы, теперь вы можете войти');
        } else {
          setError(response.message);
        }
      });
    };

    return (
      <div>
        <SimpleInput value={mail} valueSetter={setMail} placeholder="E-mail" label="E-mail" borderColor="#ffffff" />
        <br />
        <SimpleInput value={username} valueSetter={setName} placeholder="Минимум 4 символа" label="Nickname" borderColor="#ffffff" />
        <br />
        <SimpleInput value={pass} valueSetter={setPass} placeholder="Password" label="Password" borderColor="#ffffff" />
        <br />
        {registerErr &&
          <div className="errors">{registerErr}</div>
        }
        <div className="control-row">
          <Button onClick={onReg}>Register</Button>
        </div>
      </div>
    );
}
