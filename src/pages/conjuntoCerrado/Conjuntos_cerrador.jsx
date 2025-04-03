import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Spin,
  Table,
  Alert,
  Row,
  Col,
  Typography,
  Input,
  Dropdown,
  Menu,
  Card,
  Statistic,
  Modal,
} from "antd";
import {
  SearchOutlined,
  DownloadOutlined,
  ClearOutlined,
  PlusOutlined,
  LoadingOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  EditOutlined,
  EyeOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";

//Servicios
import {
  getConjuntoImage,
  obtenerConjuntos,
} from "../../services/conjuntos/ConjuntoService";
import Form_conjunto from "./Form_conjunto";
import VisorModelo3D from "./Modelo3DViewer";
import ExportExcel from "../../components/ExportExcel";
import ExportPDF from "../../components/ExportPDF";
import ParkingManagement from "../Vigilante/ParkingManagement";

const { Title } = Typography;

const Conjunto_cerrado = () => {
  const user = useSelector((state) => state.user);
  const [dataCojuntos, setDataConjuntos] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFormulario, setShowFormulario] = useState(false);
  const [dataConjuntoSElecionado, setDataConjuntoSElecionado] = useState({});
  const [modeloSeleccionado, setModeloSeleccionado] = useState(null);
  const [error, setError] = useState(null);
  const [pagination] = useState({ pageSize: 30, current: 1 });
  const [conjuntoSelecionado, setConjuntoSelecionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [visualizarEstadoParqueadero, setVisualizarEstadoParqueadero] =
    useState(false);

  true;

  const headers = [
    "Nombre",
    "Departamento",
    "Municipio",
    "Dirección",
    "Email",
    "Teléfono",
    "# Apartamentos",
    "# Parqueaderos Visitantes",
    "# Parqueaderos Residentes",
  ];
  const keys = [
    "nombre",
    "departamento",
    "municipio",
    "direccion",
    "email_contacto",
    "telefono",
    "numero_apartamentos",
    "numero_parqueaderos_visitantes",
    "numero_parqueaderos_residentes",
  ];

  // Estado para controlar la exportación
  const [exporting, setExporting] = useState(false);
  // Estado para controlar la exportación
  const [exportingPDF, setExportingPDF] = useState(false);

  const handleExportExcel = () => {
    setExporting(true); // Activa la exportación
    setTimeout(() => setExporting(false), 500); // Resetea el estado después de exportar
  };

  const handleExportPDF = () => {
    setExportingPDF(true); // Activa la exportación
    setTimeout(() => setExportingPDF(false), 500); // Resetea el estado después de exportar
  };

  const menu = (
    <Menu>
      <Menu.Item
        key="excel"
        icon={<FileExcelOutlined />}
        onClick={handleExportExcel}
      >
        Exportar a Excel
      </Menu.Item>
      <Menu.Item key="pdf" icon={<FilePdfOutlined />} onClick={handleExportPDF}>
        Exportar a PDF
      </Menu.Item>
    </Menu>
  );

  const fetchData = async () => {
    try {
      const conjuntos = await obtenerConjuntos(user.id);
      setDataConjuntos(conjuntos);
      setFilteredData(conjuntos);
    } catch (err) {
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = async (record) => {
    setShowFormulario(true);
    setDataConjuntoSElecionado(record);
  };

  const VisializarModelo3D = async (record) => {
    const imageUrl = getConjuntoImage(record.soporte_path);
    setModeloSeleccionado(imageUrl);
  };

  const abrirModalParqueadero = (id) => {
    setConjuntoSelecionado(id);
    setModalVisible(true);
    setVisualizarEstadoParqueadero(true);
  };

  const cerrarModalParqueadero = () => {
    setModalVisible(false);
    setVisualizarEstadoParqueadero(false);
  };

  const cerrarModal = () => {
    setModalVisible(false);
  };

  const onVolver = () => {
    setShowFormulario(false);
    setDataConjuntoSElecionado({});
    fetchData();
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    filterData(value);
  };

  const filterData = (texto) => {
    let filtered = [...dataCojuntos];

    // Filtro por texto de búsqueda
    if (texto?.trim()) {
      // Verifica que no sea nulo, vacío o solo espacios
      filtered = filtered.filter((conjunto) =>
        Object.values(conjunto).some(
          (val) =>
            typeof val === "string" &&
            val.toLowerCase().includes(texto.toLowerCase())
        )
      );
    }

    // Actualiza los datos filtrados
    setFilteredData(filtered);
  };

  const handleClearFilters = () => {
    setSearchText("");
    setFilteredData(dataCojuntos);
  };
  const columns = [
    {
      title: "Acciones",
      dataIndex: "actions",
      key: "actions",
      width: 150,
      render: (text, record) => (
        <>
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          />

          {record.soporte_path && (
            <Button
              type="primary"
              shape="circle"
              icon={<EyeOutlined />}
              size="small"
              style={{
                marginLeft: 8,
                backgroundColor: "#00C1FF",
                borderColor: "#00C1FF",
              }}
              onClick={() => VisializarModelo3D(record)}
            />
          )}

          <Button
            type="primary"
            shape="circle"
            icon={<DashboardOutlined />}
            size="small"
            style={{
              marginLeft: 8,
              backgroundColor: "#ec7c06",
              borderColor: "#ec7c06",
            }}
            onClick={() => abrirModalParqueadero(record.id)}
          />
        </>
      ),
    },

    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      width: 100,
    },

    {
      title: "Departamento",
      dataIndex: "departamento",
      key: "departamento",
      width: 100,
    },
    {
      title: "Municipio",
      dataIndex: "municipio",
      key: "municipio",
      width: 100,
    },
    {
      title: "Dirección",
      dataIndex: "direccion",
      key: "direccion",
      width: 100,
    },
    {
      title: "Email",
      dataIndex: "email_contacto",
      key: "email_contacto",
      width: 200,
    },
    {
      title: "Número de apartamentos",
      dataIndex: "numero_apartamentos",
      key: "numero_apartamentos",
      width: 200,
    },

    {
      title: "# de parqueaderos residentes",
      dataIndex: "numero_parqueaderos_residentes",
      key: "numero_parqueaderos_residentes",
      width: 200,
    },
    {
      title: "# de parqueaderos visiatantes",
      dataIndex: "numero_parqueaderos_visitantes",
      key: "numero_parqueaderos_visitantes",
      width: 200,
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }

  return (
    <div className="container">
      {showFormulario ? (
        <Form_conjunto
          initialData={dataConjuntoSElecionado}
          onVolver={onVolver}
        ></Form_conjunto>
      ) : (
        <>
          <div className="row mb-2 d-flex align-items-center">
            <div className="col-md-12 linea_separador mb-2 d-flex align-items-center">
              <div
                className="titulo_proyecto"
                style={{ flexBasis: "25%", flexGrow: 0 }}
              >
                <p>Gestión de conjuntos cerrados</p>
              </div>
              <div className="objeto" style={{ flexBasis: "75%", flexGrow: 0 }}>
                <p>
                  Administra eficientemente los conjuntos cerrados, incluyendo
                  una solución integral para la administración eficiente de
                  comunidades residenciales. Nuestro objetivo es facilitar la
                  labor de propietarios y administradores, brindando
                  herramientas avanzadas y una interfaz amigable para gestionar
                  todos los aspectos de su conjunto cerrado.
                </p>
              </div>
            </div>
            <Row gutter={[16, 16]} className="mb-4">
              <Col span={24}>
                <div className="filter-container">
                  <Row gutter={[16, 16]} align="middle">
                    {/* Barra de búsqueda */}
                    <Col xs={24} sm={12} md={6} lg={10}>
                      <div className="filter-item">
                        <Title
                          level={5}
                          className="filter-label"
                          style={{ color: "#042956" }}
                        >
                          Búsqueda
                        </Title>
                        <Input
                          placeholder="Buscar..."
                          prefix={<SearchOutlined />}
                          value={searchText}
                          onChange={handleSearch}
                        />
                      </div>
                    </Col>

                    {/* Botón Limpiar */}
                    <Col xs={12} sm={6} md={3} lg={3}>
                      <Button
                        type="primary"
                        icon={<ClearOutlined />}
                        style={{ width: "100%", marginTop: "24px" }}
                        onClick={handleClearFilters}
                      >
                        Limpiar
                      </Button>
                    </Col>
                    <Col xs={12} sm={6} md={3} lg={3}>
                      <Dropdown overlay={menu} placement="bottomLeft">
                        <Button
                          type="primary"
                          style={{ width: "100%", marginTop: "24px" }}
                          icon={<DownloadOutlined />}
                        >
                          Exportar
                        </Button>
                      </Dropdown>
                      {/* Renderiza el componente solo cuando exporting es true */}
                      {exporting && (
                        <ExportExcel
                          headers={headers}
                          keys={keys}
                          data={filteredData}
                          fileName={"Reporte_conjuntos"}
                        />
                      )}
                      {exportingPDF && (
                        <ExportPDF
                          title={"LISTA DE CONJUNTOS CERRADOS"}
                          headers={headers}
                          keys={keys}
                          data={filteredData}
                          fileName={"Reporte_conjuntos"}
                        />
                      )}
                    </Col>

                    <Col xs={12} sm={6} md={3} lg={3}>
                      <Button
                        type="primary"
                        onClick={() => setShowFormulario(true)}
                        style={{
                          width: "100%",
                          marginTop: "24px",
                          backgroundColor: "#52c41a",
                          borderColor: "#52c41a",
                        }}
                        icon={<PlusOutlined />}
                      >
                        Nuevo
                      </Button>
                    </Col>

                    {/* Total */}
                    <Col xs={12} sm={6} md={3} lg={3}>
                      <Card
                        size="small"
                        style={{
                          marginTop: "24px",
                          textAlign: "center",
                          backgroundColor: "#f0f5ff", // Fondo azul claro
                        }}
                      >
                        <Statistic
                          title="Total conjuntos"
                          value={filteredData.length}
                          valueStyle={{
                            color: "#1890ff",
                            fontWeight: "bold",
                          }}
                        />
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
            <div className="row mb-4">
              <div className="col-12">
                {filteredData.length > 0 ? (
                  <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    bordered
                    pagination={pagination}
                    sortDirections={["ascend", "descend"]}
                    loading={loading}
                    scroll={{ y: 400, x: "max-content" }}
                  />
                ) : (
                  <div style={{ textAlign: "center", margin: "20px" }}>
                    <Alert
                      message="No hay resultados"
                      description="No se encontraron conjuntos cerrados"
                      type="info"
                      showIcon
                    />
                  </div>
                )}
              </div>
            </div>
            {modeloSeleccionado && (
              <VisorModelo3D
                url={modeloSeleccionado}
                onClose={() => setModeloSeleccionado(null)}
              />
            )}
            <div>
              {/* Tu tabla u otros componentes */}
              {visualizarEstadoParqueadero && (
                <Modal
                  title="Estado del Parqueadero"
                  visible={modalVisible}
                  onCancel={cerrarModalParqueadero}
                  footer={null}
                  width="80%"
                  destroyOnClose
                  bodyStyle={{
                    maxHeight: "70vh", // Altura máxima del 70% del viewport
                    overflowY: "auto", // Scroll vertical si el contenido excede la altura
                    padding: "16px 24px", // Padding consistente con el diseño de Ant Design
                  }}
                >
                  <ParkingManagement idConjunto={conjuntoSelecionado} />
                </Modal>
              )}
            </div>{" "}
          </div>
        </>
      )}
    </div>
  );
};

export default Conjunto_cerrado;
