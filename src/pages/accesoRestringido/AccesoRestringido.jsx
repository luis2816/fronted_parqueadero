import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const AccesoRestringido = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/');
  };

  return (
    <Result
      status="403"
      title="Acceso restringido"
      subTitle="Usted está intentando ingresar a 
                información restringida y protegida 
                con nuestras políticas de privacidad y 
                seguridad de la información."
      extra={<Button type="primary" onClick={handleButtonClick}>Iniciar sesión</Button>}
    />
  );
};

export default AccesoRestringido;
