import React, { useState, useEffect } from "react";
import {
  Spin,
  Alert,
  Statistic,
  Typography,
  Card,
  Row,
  Col,
  Table,
  Tag,
  Tooltip,
  Button,
  Empty,
} from "antd";
import {
  CarOutlined,
  HomeOutlined,
  NumberOutlined,
  ClockCircleOutlined,
  ExpandOutlined,
  ShrinkOutlined,
} from "@ant-design/icons";
import ParkingLot from "../../Visualizacion_conjunto_3d";
import { obtenerEstadoarqueadero } from "../../services/movimiento_vehiculos/movimientoVehicularServices";
import ParkingReport from "../informes/ParkingReport";

const { Title } = Typography;

const ParkingManagement = ({ idConjunto }) => {
  const [parkingData, setParkingData] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTable, setShowTable] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const POLLING_INTERVAL = 3000;

    const fetchParkingData = async () => {
      try {
        const result = await obtenerEstadoarqueadero(idConjunto);

        if (!isMounted) return;

        if (result.status) {
          setParkingData(result.data);
          const detalle = result.data.detalle || {};
          const tableData = Object.entries(detalle).map(([key, value]) => ({
            key: key,
            ...value,
            parqueadero: key,
            feha_hora: new Date(value.feha_hora),
          }));
          setDataSource(tableData);
          setError(null);
        } else {
          setError(result.error || "Error al obtener datos");
        }
      } catch (err) {
        if (isMounted) {
          setError("Error de conexión con el servidor");
          console.error("Error fetching parking data:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchParkingData();
    const intervalId = setInterval(fetchParkingData, POLLING_INTERVAL);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [idConjunto]);

  const apartments = {
    1: { position: [50, 38, 37], parkingSpace: 1 },
    2: { position: [50, 26, 37], parkingSpace: 2 },
    3: { position: [50, 14, 37], parkingSpace: 3 },
    4: { position: [50, 0, 37], parkingSpace: 4 },
  };

  const columns = [
    {
      title: "N° Parqueadero",
      dataIndex: "parqueadero",
      key: "parqueadero",
      align: "center",
      sorter: (a, b) => a.parqueadero - b.parqueadero,
      render: (text) => <Tag color="blue">#{text}</Tag>,
    },
    {
      title: "Vehículo",
      key: "vehiculo",
      render: (_, record) => (
        <>
          <div>
            <strong>
              <Tag color="blue">#{record.placa}</Tag>
            </strong>
          </div>
          <div style={{ color: "#666", fontSize: "12px" }}>
            {record.marca || "Sin marca"} {record.modelo || ""}
          </div>
        </>
      ),
    },
    {
      title: "Residente",
      key: "residente",
      render: (_, record) => (
        <>
          <div>
            <strong>{record.nombre}</strong>
          </div>
          <div style={{ color: "#666" }}>Apto. {record.apartamento}</div>
        </>
      ),
    },
    {
      title: "Horario",
      key: "horario",
      render: (_, record) => {
        // Función segura para parsear fechas ISO
        const parseDate = (dateString) => {
          if (!dateString) return null;
          // Asegurarse que es un string válido
          if (typeof dateString !== "string") return null;
          try {
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? null : date;
          } catch {
            return null;
          }
        };

        // Parsear fechas
        const fechaEntrada = parseDate(record.fecha_hora);
        const fechaSalida = parseDate(record.salida);

        // Opciones de formato para español
        const formatOptions = {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "UTC", // Opcional: usar si las fechas deben mostrarse en UTC
        };

        // Mostrar contenido según disponibilidad de fechas
        return (
          <div>
            {fechaEntrada ? (
              <>
                <div>
                  <strong>Entrada:</strong>{" "}
                  {fechaEntrada.toLocaleString("es-ES", formatOptions)}
                </div>
                {fechaSalida ? (
                  <div>
                    <strong>Salida:</strong>{" "}
                    {fechaSalida.toLocaleString("es-ES", formatOptions)}
                  </div>
                ) : (
                  <Tag color="orange" icon={<ClockCircleOutlined />}>
                    Estacionado
                  </Tag>
                )}
              </>
            ) : (
              <Tag color="red">Fecha no disponible</Tag>
            )}
          </div>
        );
      },
    },
    {
      title: "Tiempo",
      key: "tiempo",
      render: (_, record) => {
        const entrada = new Date(record.fecha_hora);
        const ahora = new Date();
        const diffHours = Math.floor((ahora - entrada) / (1000 * 60 * 60));

        return (
          <Tooltip title={`Desde ${entrada.toLocaleString()}`}>
            <Tag
              color={
                diffHours > 24 ? "red" : diffHours > 12 ? "orange" : "green"
              }
            >
              {diffHours > 24
                ? `${Math.floor(diffHours / 24)}d`
                : `${diffHours}h`}
            </Tag>
          </Tooltip>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "50px" }}
      >
        <Spin tip="Cargando..." size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        style={{ margin: 24 }}
      />
    );
  }

  if (!parkingData) {
    return (
      <Alert
        message="No hay datos disponibles"
        type="warning"
        showIcon
        style={{ margin: 24 }}
      />
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Panel de estadísticas */}
      <Card
        title={`Gestión de Parqueaderos - ${
          parkingData.conjunto?.nombre || "Conjunto"
        }`}
        style={{ marginBottom: 24 }}
        headStyle={{ fontSize: "18px", fontWeight: "bold" }}
      >
        <Row gutter={16} justify="space-around">
          <Col xs={24} sm={8} md={8} lg={8}>
            <Card bordered={false}>
              <Statistic
                title="Total de Espacios"
                value={parkingData.totalSpaces}
                prefix={<NumberOutlined style={{ color: "#1890ff" }} />}
                valueStyle={{ color: "#1890ff", fontSize: "24px" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={8} lg={8}>
            <Card bordered={false}>
              <Statistic
                title="Espacios Ocupados"
                value={
                  parkingData.parkingSpaces?.filter(
                    (p) => p.status === "occupied"
                  ).length || 0
                }
                prefix={<CarOutlined style={{ color: "#f5222d" }} />}
                valueStyle={{ color: "#f5222d", fontSize: "24px" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={8} lg={8}>
            <Card
              bordered={false}
              style={{ background: "#f6ffed", borderLeft: "4px solid #52c41a" }}
            >
              <Statistic
                title="Espacios Disponibles"
                value={
                  parkingData.parkingSpaces?.filter(
                    (p) => p.status === "available"
                  ).length || 0
                }
                prefix={<HomeOutlined style={{ color: "#52c41a" }} />}
                valueStyle={{
                  color: "#52c41a",
                  fontSize: "28px",
                  fontWeight: "bold",
                }}
                suffix={
                  <span style={{ fontSize: "14px", color: "#666" }}>
                    (
                    {(
                      (parkingData.parkingSpaces?.filter(
                        (p) => p.status === "available"
                      ).length /
                        parkingData.totalSpaces) *
                        100 || 0
                    ).toFixed(0)}
                    % disponibilidad)
                  </span>
                }
              />
            </Card>
          </Col>
        </Row>
      </Card>

      <div style={{ padding: "24px", height: "calc(100vh - 48px)" }}>
        <Row gutter={24} style={{ height: "100%", marginBottom: 0 }}>
          {/* Columna de la tabla (condicional) */}
          {showTable && (
            <Col
              xs={24}
              md={12}
              lg={10}
              xl={12}
              style={{
                height: "100%",
                paddingRight: 12,
                transition: "all 0.3s ease",
              }}
            >
              <Card
                title="Registro de Parqueaderos Ocupados"
                headStyle={{ borderBottom: 0 }}
                extra={
                  <Tag color="volcano">
                    {dataSource.filter((item) => !item.salida).length} ocupados
                    ahora
                  </Tag>
                }
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                bodyStyle={{
                  flex: 1,
                  overflow: "hidden",
                  padding: 0,
                }}
              >
                <div style={{ height: "100%", overflow: "auto" }}>
                  {dataSource && dataSource.length > 0 ? (
                    <Table
                      columns={columns}
                      dataSource={dataSource}
                      pagination={{ pageSize: 5 }}
                      scroll={{ x: true }}
                      rowClassName={(record) =>
                        !record.salida ? "active-parking-row" : ""
                      }
                    />
                  ) : (
                    <div style={{ margin: "24px 0" }}>
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                          <div>
                            <p style={{ marginBottom: 4 }}>
                              No hay registros de parqueaderos ocupados
                            </p>
                            <small style={{ color: "#999" }}>
                              Todos los espacios están disponibles
                            </small>
                          </div>
                        }
                      />
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          )}
          {/* Columna del visualizador 3D */}
          <Col
            xs={24}
            md={showTable ? 12 : 24}
            lg={showTable ? 14 : 24}
            xl={showTable ? 12 : 24}
            style={{
              height: "100%",
              paddingLeft: showTable ? 12 : 0,
              transition: "all 0.3s ease",
            }}
          >
            <Card
              title="Visualización 3D de Parqueaderos"
              headStyle={{ borderBottom: 0 }}
              extra={
                <Button
                  type="text"
                  icon={showTable ? <ExpandOutlined /> : <ShrinkOutlined />}
                  onClick={() => setShowTable(!showTable)}
                />
              }
              style={{
                height: "100%",
                margin: 0,
              }}
              bodyStyle={{
                height: "calc(100% - 56px)",
                padding: 0,
              }}
            >
              <ParkingLot
                totalSpaces={parkingData.totalSpaces}
                parkingSpaces={parkingData.parkingSpaces}
                apartments={apartments}
                style={{
                  height: "100%",
                  width: "100%",
                  backgroundColor: "#f0f2f5", // Color de fondo temporal
                }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ParkingManagement;
