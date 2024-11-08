import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Result, Button, Typography, Spin } from 'antd';
import { obtenerDetalleCompra_id } from '../../services/usuarioServices'; // Asegúrate de que la ruta sea correcta


const { Text } = Typography;

const Success = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id_transaccion = queryParams.get('collection_id');
  // Estado para almacenar los datos de la compra
  const [purchaseData, setPurchaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  
    const fetchPurchaseData = async () => {
      try {
        const data = await obtenerDetalleCompra_id(id_transaccion); // Llama a tu servicio
        console.log(data)
        if (!data) {
          throw new Error('No se encontraron datos de la compra');
        }
        setPurchaseData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseData();
  }, [id_transaccion]);

  // Si estamos cargando, mostramos un spinner
  if (loading) {
    return <Spin size="large" />;
  }

  // Si hubo un error, mostramos el mensaje de error
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Verifica que purchaseData tenga datos
  if (!purchaseData) {
    return <div>No se encontraron datos de compra.</div>;
  }

  // Datos de la compra, asegurándonos de que no sean undefined
  const purchaseDate = new Date(purchaseData.fecha_registro).toLocaleDateString(); // Asegúrate que la fecha esté en el formato correcto
  const buyerName = purchaseData.nombre + '' + purchaseData.apellido  || "Nombre no disponible"; // Nombre del comprador desde la API
  const buyerId = purchaseData.numero_identificacion || "ID no disponible"; // ID del comprador desde la API
  const licensesQuantity = purchaseData.cantidad_licencia ? Number(purchaseData.cantidad_licencia) : 0; // Asegúrate de convertir a número
  const totalAmount = purchaseData.cantidad_licencia * 1000 || "$0.00"; // Monto total desde la API
  const orderNumber = purchaseData.id_transaccion || "Número de orden no disponible"; // Número de orden desde la API

  return (
    <div style={{ padding: '40px', backgroundColor: '#f0f2f5' }}>
      <Result
        status="success"
        title="¡Compra Realizada con Éxito!"
        subTitle={
          <>
            Número de orden: {orderNumber} - 
            <Text strong style={{ fontSize: '24px', color: '#4CAF50', marginLeft: '5px' }}>
              {licensesQuantity} Licencias
            </Text> compradas
          </>
        }
        extra={[
          <Text key="buyer" strong style={{ fontSize: '16px' }}>
            Comprador: {buyerName} (Cédula: {buyerId})
          </Text>,
          <Text key="date" style={{ display: 'block', marginTop: '10px' }}>
            Fecha de compra: {purchaseDate}
          </Text>,
          <Text key="amount" style={{ display: 'block', marginTop: '10px' }}>
            Total: {totalAmount}
          </Text>,
          <Button type="primary" key="console" style={{ marginTop: '20px' }}>
            Iniciar sesión
          </Button>,
        ]}
      />
    </div>
  );
};

export default Success;
