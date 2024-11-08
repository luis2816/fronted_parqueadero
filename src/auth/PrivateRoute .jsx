import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (token) {
    // Si el token existe, renderiza el elemento
    return element;
  } else {
    // Si no hay token, redirige al login y recuerda la ubicación
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};

export default PrivateRoute;
