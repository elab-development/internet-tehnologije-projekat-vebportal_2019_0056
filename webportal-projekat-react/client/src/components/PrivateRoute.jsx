import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useLoggedIn } from '../hooks/useLoggedIn.hook';

const PrivateRoute = () => {
  const isLoggedIn = useLoggedIn();

  return isLoggedIn ? <Outlet /> : <Navigate to='/sign-in' replace />;
};

export default PrivateRoute;