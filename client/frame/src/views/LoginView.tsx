import { PrimaryButton, Spinner, Stack, TextField } from '@fluentui/react';
import React, { useContext, useState } from 'react';
import { MessageBoxContext } from '../MessageBoxProvider';
import ajax, { LoginResponseType } from '../utils/ajax';
import crypto from 'crypto';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router';

interface LoginProps {}

const LoginView: React.FC<LoginProps> = () => {

  const { showMessages } = useContext(MessageBoxContext);

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [cookies, setCookies] = useCookies(['token', 'isTeacher']);
  const [isLoading, setLoading] = useState<boolean>(false);

  const history = useHistory();

  const handleLogin = (e: React.MouseEvent<PrimaryButton>) => {
    e.preventDefault();

    if (!process.env.REACT_APP_HASH_ALGORITHM) {
      showMessages([{ severity: 'ERROR', messageText: 'Nincs megadva hash algoritmus! Keresd fel az illetékes(eke)t!' }]);
      return;
    }
    setLoading(true);

    ajax.post('auth/login', {
      name: username,
      password: crypto.createHash(process.env.REACT_APP_HASH_ALGORITHM).update(password).digest('hex')
    }).then(
      (result: LoginResponseType) => {
        setLoading(false);

        if (result?.severity) {
          showMessages(result.messages.map(
            (message) => ({ severity: result.severity, messageText: message })
          ));
          return;
        }

        const date = new Date();
        date.setHours(date.getHours() + 2);

        setCookies('token', result.token, {
          expires: date
        });
        setCookies('isTeacher', result.isTeacher, {
          expires: date
        });
        history.push('/');
      }
    );
  };

  return (
    <Stack horizontalAlign='center' verticalAlign='center'>
      {isLoading ? <Spinner /> : null}
      <form>
        <TextField label='Felhasználónév' onChange={(e) => setUsername(e.currentTarget.value)}/>
        <TextField type='password' canRevealPassword label='Jelszó' onChange={(e) => setPassword(e.currentTarget.value)}/>
        <PrimaryButton text='Belépés' style={{ marginTop: '1vh' }} onClick={handleLogin} />
      </form>
    </Stack>
  );
};

export default LoginView;