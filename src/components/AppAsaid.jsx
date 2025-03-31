import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, VideoCameraOutlined, LogoutOutlined, LockOutlined, BarChartOutlined} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { handleLogout } from '../auth/authUtils';
import { useDispatch } from 'react-redux';

const { Sider } = Layout;

const AppAsaid = () => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    handleLogout(dispatch, navigate);
  };

  // Define los ítems del menú
  const menuItems = [
    {
      key: '1',
      icon: <UserOutlined />,
      label: <Link to="/dashboard/usuarios">Usuarios</Link>,
    },
    {
      key: '2',
      icon: <VideoCameraOutlined />,
      label: <Link to="/dashboard/conjunto_cerrado">Conjuntos Cerrados</Link>,
    },
    {
      key: '3',
      icon: <VideoCameraOutlined />,
      label: <Link to="/dashboard/gestion_vigilantes">Gestión vigilantes</Link>,
    },
    
    {
      key: '4',
      icon: <VideoCameraOutlined />,
      label: <Link to="/dashboard/gestion_residentes">Gestión residentes</Link>,
    },
    {
      key: '5',
      icon: <VideoCameraOutlined />,
      label: <Link to="/dashboard/parkingManager">parkingManager</Link>,
    },
    {
      key: '6',
      icon: <LockOutlined />,
      label: <Link to="/dashboard/updatePassword">Cambiar contraseña</Link>,
    },

    {
      key: '7',
      icon: <BarChartOutlined />,
      label: <Link to="/dashboard/informe-parqueaderos">Informe por parqueadero</Link>,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Cerrar Sesión',
      onClick: onLogout,
    },
  ];

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
      <div className="demo-logo-vertical" />
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={menuItems} />
    </Sider>
  );
};

export default AppAsaid;
