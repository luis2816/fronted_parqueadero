import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  VideoCameraOutlined,
  LogoutOutlined,
  LockOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { handleLogout } from "../auth/authUtils";
import { useSelector, useDispatch } from "react-redux";

const { Sider } = Layout;

const AppAsaid = () => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const rol = user.rol_id; // Ahora es un número: 1 (admin), 2 (vigilante), 3 (residente)
  const id_conjunto = user.id_conjunto;
  
  const onLogout = () => {
    handleLogout(dispatch, navigate);
  };

  // Ítems del menú con roles numéricos
  const allMenuItems = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: <Link to="/dashboard/usuarios">Usuarios</Link>,
      roles: [1], // Solo admin (rol 1)
    },
    {
      key: "2",
      icon: <VideoCameraOutlined />,
      label: <Link to="/dashboard/conjunto_cerrado">Conjuntos Cerrados</Link>,
      roles: [1], // admin y vigilante
    },
    {
      key: "3",
      icon: <VideoCameraOutlined />,
      label: <Link to="/dashboard/gestion_vigilantes">Gestión vigilantes</Link>,
      roles: [1], // Solo admin
    },
    {
      key: "4",
      icon: <VideoCameraOutlined />,
      label: <Link to="/dashboard/gestion_residentes">Gestión residentes</Link>,
      roles: [1], // admin y vigilante
    },
    {
      key: "5",
      icon: <VideoCameraOutlined />,
      label: <Link to="/dashboard/visualizacion_conjunto">ParkingManager</Link>,
      roles: [2], // Todos los roles
    },
    {
      key: "6",
      icon: <BarChartOutlined />,
      label: (
        <Link to="/dashboard/informe-parqueaderos">
          Informe por parqueadero
        </Link>
      ),
      roles: [2], // Solo admin
    },
    {
      key: "7",
      icon: <LockOutlined />,
      label: <Link to="/dashboard/updatePassword">Cambiar contraseña</Link>,
      roles: [1, 2, 3], // Todos los roles
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Cerrar Sesión",
      onClick: onLogout,
      roles: [1, 2, 3], // Todos los roles
    },
  ];

  // Filtra los ítems según el rol numérico del usuario
  const filteredMenuItems = allMenuItems.filter((item) =>
    item.roles.includes(rol)
  );

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        defaultSelectedKeys={["1"]}
        mode="inline"
        items={filteredMenuItems}
      />
    </Sider>
  );
};

export default AppAsaid;
