import React, {useState, useEffect} from "react";
import { Link } from 'react-router-dom';
import { Button, Spin, Table, Alert} from "antd";
import {SearchOutlined, DownloadOutlined, ClearOutlined, PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { useSelector } from 'react-redux';


//Servicios
import { obtenerConjuntos } from "../../services/conjuntos/ConjuntoService";

const Conjunto_cerrado = () => {

const user = useSelector((state) => state.user);
const [dataCojuntos, setDataConjuntos] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [pagination] = useState({ pageSize: 30, current: 1 });



const fetchData = async () => {
    try {
      const conjuntos = await obtenerConjuntos(user.id);
      setDataConjuntos(conjuntos);
      console.log(dataCojuntos)

    } catch (err) {
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);


  const columns = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      width: 100,
    },

    {
      title: "Ciudad",
      dataIndex: "ciudad",
      key: "ciuudad",
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
            <div className="row mb-2 d-flex align-items-center">
                <div className="col-md-8 linea_separador mb-2 d-flex align-items-center">
                    <div
                        className="titulo_proyecto"
                        style={{ flexBasis: "25%", flexGrow: 0 }}
                    >
                        <p>Gestión de conjuntos cerrados</p>
                    </div>
                    <div className="objeto" style={{ flexBasis: "75%", flexGrow: 0 }}>
                        <p>
                            Administra eficientemente los conjuntos cerrados, incluyendo
                            una solución integral para la administración eficiente de comunidades
                            residenciales. Nuestro objetivo es facilitar la labor de propietarios
                            y administradores, brindando herramientas avanzadas y una interfaz amigable
                            para gestionar todos los aspectos de su conjunto cerrado.
                        </p>
                    </div>
                </div>

                <div className="col-md-4 d-flex justify-content-center align-items-center flex-column">
                    <h2 className="text-center mb-2">Listado de Conjuntos cerrados</h2>
                    <div className="row mb-4">
                        <div className="col-md-12">
                            <div className="input-group shadow-sm">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar conjunto cerrado..."
                                />
                                <button
                                    className="btn btn-primary"
                                    type="button"
                                >
                                    <SearchOutlined /> {/* Incluye el icono aquí */}
                                </button>
                            </div>
                        </div>
                        <div className="col-md-12 mt-2">
                            <div className="d-flex justify-content-end mt-2">
                                <Link to="/dashboard/registrar-conjunto">
                                    <Button
                                        type="primary"
                                        className="btn btn-primary me-2"
                                        size="large"
                                        icon={<PlusOutlined  />}
                                    >
                                        Nuevo
                                    </Button>
                                </Link>

                                <Button
                                    type="primary"
                                    className="btn btn-primary me-2"
                                    //onClick={exportToExcel}
                                    size="large"
                                    icon={<DownloadOutlined />}
                                >
                                    Excel
                                </Button>
                                <Button
                                    type="primary"
                                    className="btn btn-primary"
                                    //onClick={clearAllFilters}
                                    size="large"
                                    icon={<ClearOutlined />}
                                >
                                    Limpiar
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>


                <Table
        columns={columns}
        dataSource={dataCojuntos}
        rowKey="id"
        bordered
        pagination={pagination}
        sortDirections={["ascend", "descend"]}
        loading={loading}
        scroll={{ y: 400, x: "max-content" }}
      />
            </div>
        </div>
    );
}

export default Conjunto_cerrado;
