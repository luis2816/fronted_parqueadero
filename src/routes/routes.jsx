import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Usuarios from '../pages/Usuarios';
import Conjuntos_cerrador from '../pages/conjuntoCerrado/Conjuntos_cerrador';
import Login from '../pages/login/Login';
import AccesoRestringido from '../pages/accesoRestringido/AccesoRestringido';
import Template from './Template'; // Ajusta la ruta según tu estructura
import PrivateRoute from '../auth/PrivateRoute ';
import Perfil from '../pages/updatePerfil/Perfil';
import UpdatePassword from '../pages/updatePassword/UpdatePassword';
import Form_conjunto from '../pages/conjuntoCerrado/Form_conjunto';
import ParkingManagement from '../pages/Vigilante/ParkingManagement';
import ResetPassword from '../pages/updatePassword/ResetPassword';
import Comprar from '../pages/compra/registrarCompra';
import Success from '../pages/compra/succes';
import Vigilante from '../pages/Vigilante/Vigilante';
import InformeParqueadero from '../pages/informes/InformeParqueadero';
import Residentes from '../pages/residentes/Residentes';

const AppRoutes = () => {

  return (
    <Routes>
      {/* Ruta para la página de login */}
      <Route path="/" element={<Login />} />


      {/* Ruta para el Dashboard que está protegida */}
      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute
            element={
              <Template>
                <Routes>
                  <Route path="conjunto_cerrado" element={<Conjuntos_cerrador />} />
                  <Route path="registrar-conjunto" element={<Form_conjunto />} />
                  <Route path="gestion_vigilantes" element={<Vigilante />} />
                  <Route path="gestion_residentes" element={<Residentes />} />
                  <Route path="perfil" element={<Perfil />} />
                  <Route path="usuarios" element={<Usuarios />} />
                  <Route path="updatePassword" element={<UpdatePassword />} />
                  <Route path="parkingManager" element={<ParkingManagement />} />
                  <Route path="informe-parqueaderos" element={<InformeParqueadero />} />
                  {/* Agrega más rutas protegidas aquí */}
                </Routes>
              </Template>
            }
          />
        }
      />
      <Route path="/success"element={<Success />} />
      <Route path="/comprar" element={<Comprar />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/acceso-restringido" element={<AccesoRestringido />} />
      <Route path="*" element={<Navigate to="/acceso-restringido" />} />
    </Routes>
  );
};

export default AppRoutes;
