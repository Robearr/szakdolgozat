import { PrimaryButton, Stack, TextField } from '@fluentui/react';
import React, { useContext, useState } from 'react';
import { MessageBoxContext } from '../MessageBoxProvider';
import ajax, { LoginResponseType } from '../utils/ajax';

interface LoginProps {}

const LoginView: React.FC<LoginProps> = () => {

  const { showMessage } = useContext(MessageBoxContext);

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = (e: React.MouseEvent<PrimaryButton>) => {
    e.preventDefault();

    ajax.post('auth/login', {
      name: username,
      password
    }).then(
      (result: LoginResponseType) => {
        if (result?.severity) {
          result.messages.forEach(
            (message) => showMessage(result.severity, message)
          );
        }
      }
    );
  };

  return (
    <Stack horizontalAlign='center' verticalAlign='center'>
      <form>
        <TextField label='Felhasználónév' onChange={(e) => setUsername(e.currentTarget.value)}/>
        <TextField type='password' canRevealPassword label='Jelszó' onChange={(e) => setPassword(e.currentTarget.value)}/>
        <PrimaryButton text='Belépés' onClick={handleLogin} />
      </form>
    </Stack>
  );
};

export default LoginView;