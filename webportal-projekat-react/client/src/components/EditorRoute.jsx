import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { usePrivilege } from '../hooks/usePrivilege.hook';

const EditorRoute = () => {
  const isEditor = usePrivilege('editor');

  return isEditor ? <Outlet /> : <Navigate to='/' replace />;
};

export default EditorRoute;