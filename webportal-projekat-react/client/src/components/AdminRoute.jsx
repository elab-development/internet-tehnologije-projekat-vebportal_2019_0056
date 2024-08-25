import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { usePrivilege } from '../hooks/usePrivilege.hook';

const AdminRoute = () => {
  const isAdmin = usePrivilege('admin');

  return isAdmin ? <Outlet /> : <Navigate to='/' replace />;
};

export default AdminRoute;