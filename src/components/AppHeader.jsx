import React from 'react';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Avatar, Badge, Layout, Typography, Dropdown, Menu } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { handleLogout } from '../auth/authUtils';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Text } = Typography;

const AppHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const userName = user.primer_nombre + ' ' + user.primer_apellido;

  // Agrega una marca de tiempo a la URL de la imagen para evitar el uso de caché
  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => navigate('/dashboard/perfil')}>
        Perfil
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={() => handleLogout(dispatch, navigate)}>
        Cerrar Sesión
      </Menu.Item>
    </Menu>
  );

  return (
    <Header style={{ padding: '0 16px', background: '#f0f2f5', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
      <Dropdown overlay={menu} trigger={['click']}>
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <Text style={{ marginRight: 8 }}>{userName}</Text>
          <Badge dot status="success" offset={[0, 15]}>
            <Avatar shape="square" icon={<UserOutlined />} src={user.foto_perfil_url} />
          </Badge>
        </div>
      </Dropdown>
    </Header>
  );
};

export default AppHeader;
