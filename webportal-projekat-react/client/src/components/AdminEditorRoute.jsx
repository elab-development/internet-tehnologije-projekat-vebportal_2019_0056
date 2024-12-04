import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { usePrivilege } from '../hooks/usePrivilege.hook';

const AdminEditorRoute = () => {
  const isAdminEditor = usePrivilege('admineditor');

  return isAdminEditor ? <Outlet /> : <Navigate to='/' replace />;
};

export default AdminEditorRoute;