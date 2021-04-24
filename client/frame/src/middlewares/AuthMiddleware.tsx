import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router';

interface AuthMiddleWareProps {
  isTeacherRoute: boolean
}

const AuthMiddleware: React.FC<AuthMiddleWareProps> = ({ isTeacherRoute, children }) => {

  const [cookies, setCookies] = useCookies(['token']);
  const history = useHistory();

  useEffect(() => {
    if (!cookies?.token) {
      history.push('/login');
    }

    if (isTeacherRoute) {
      // TODO
    }

  }, []);

  return (
    <>
      {children}
    </>
  );
};

export default AuthMiddleware;