import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Layout, Tag, Tooltip, Statistic, Switch, Space } from 'antd';
import { CarOutlined, HomeOutlined, NumberOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Content } = Layout;

const ParkingSpace = ({ number, isOccupied, apartment, licensePlate }) => (
  <Card
    hoverable
    style={{
      width: '100%',
      height: 150,
      margin: '10px 0',
      backgroundColor: isOccupied ? '#52c41a' : '#f0f0f0',
      transition: 'all 0.3s ease',
    }}
  >
    <div style={{ position: 'absolute', top: 5, left: 5, fontSize: '16px', fontWeight: 'bold' }}>
      #{number}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <CarOutlined style={{ fontSize: '24px', color: isOccupied ? 'white' : '#bfbfbf', marginBottom: '10px' }} />
      <Tooltip title="Apartamento">
        <Tag icon={<HomeOutlined />} color="blue">
          {apartment || 'N/A'}
        </Tag>
      </Tooltip>
      <Tooltip title="Placa">
        <Tag icon={<NumberOutlined />} color="orange" style={{ marginTop: '5px' }}>
          {licensePlate}
        </Tag>
      </Tooltip>
    </div>
  </Card>
);

const ParkingSection = ({ title, spaces, width }) => (
  <div style={{ width: width, marginBottom: '20px' }}>
    <Title level={3}>{title}</Title>
    <Row gutter={[16, 16]}>
      {spaces.map((space) => (
        <Col span={4} key={space.number}>
          <ParkingSpace {...space} />
        </Col>
      ))}
    </Row>
  </div>
);

const ParkingSummary = ({ residentSpaces, visitorSpaces }) => {
  const availableResidents = residentSpaces.filter(space => !space.isOccupied).length;
  const availableVisitors = visitorSpaces.filter(space => !space.isOccupied).length;

  return (
    <Row gutter={16} style={{ marginBottom: '20px' }}>
      <Col span={8}>
        <Statistic title="Total Disponibles" value={availableResidents + availableVisitors} />
      </Col>
      <Col span={8}>
        <Statistic title="Residentes Disponibles" value={availableResidents} />
      </Col>
      <Col span={8}>
        <Statistic title="Visitantes Disponibles" value={availableVisitors} />
      </Col>
    </Row>
  );
};

const ParkingManagement = () => {
  const [residentSpaces, setResidentSpaces] = useState([]);
  const [visitorSpaces, setVisitorSpaces] = useState([]);
  const [showResidents, setShowResidents] = useState(true);
  const [showVisitors, setShowVisitors] = useState(true);

  useEffect(() => {
    const generateSpaces = (count, isResident, startNumber) => 
      Array(count).fill(null).map((_, index) => ({
        number: startNumber + index + 1,
        isOccupied: Math.random() > 0.5,
        apartment: isResident ? `${Math.floor(Math.random() * 100) + 101}` : null,
        licensePlate: `ABC-${Math.floor(Math.random() * 1000)}`,
      }));

    setResidentSpaces(generateSpaces(9, true, 0));
    setVisitorSpaces(generateSpaces(9, false, 9));
  }, []);

  const handleResidentSwitch = (checked) => {
    setShowResidents(checked);
    if (!checked && !showVisitors) {
      setShowVisitors(true);
    }
  };

  const handleVisitorSwitch = (checked) => {
    setShowVisitors(checked);
    if (!checked && !showResidents) {
      setShowResidents(true);
    }
  };

  const renderParkingSections = () => {
    if (showResidents && showVisitors) {
      return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <ParkingSection title="Residentes" spaces={residentSpaces} width="48%" />
          <ParkingSection title="Visitantes" spaces={visitorSpaces} width="48%" />
        </div>
      );
    } else if (showResidents) {
      return <ParkingSection title="Residentes" spaces={residentSpaces} width="100%" />;
    } else if (showVisitors) {
      return <ParkingSection title="Visitantes" spaces={visitorSpaces} width="100%" />;
    }
    return null;
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      <Content style={{ padding: '20px' }}>
        <Title level={2}>Gestión de Parqueaderos</Title>
        <ParkingSummary residentSpaces={residentSpaces} visitorSpaces={visitorSpaces} />
        <Space style={{ marginBottom: '20px' }}>
          <Switch
            checked={showResidents}
            onChange={handleResidentSwitch}
            checkedChildren="Residentes"
            unCheckedChildren="Residentes"
          />
          <Switch
            checked={showVisitors}
            onChange={handleVisitorSwitch}
            checkedChildren="Visitantes"
            unCheckedChildren="Visitantes"
          />
        </Space>
        {renderParkingSections()}
      </Content>
    </Layout>
  );
};

export default ParkingManagement;
