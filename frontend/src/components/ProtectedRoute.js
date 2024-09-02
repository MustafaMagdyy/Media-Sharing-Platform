import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ProtectedRoute = ({ component: Component }) => {
  const { user } = useUser();

  return user ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
