import React, { useState, useEffect } from "react";
import { obtenerEstadoarqueadero } from "../../services/movimiento_vehiculos/movimientoVehicularServices";
import ParkingReport from "./ParkingReport";

const InformeParqueadero = () => {
  const idConjunto = 10;
  const [parkingData, setParkingData] = useState(null);

  useEffect(() => {
    const fetchParkingData = async () => {
      try {
        const result = await obtenerEstadoarqueadero(idConjunto);
        if (result.status) {
          setParkingData(result.data);
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
  }, [idConjunto]);

  return <ParkingReport parkingData={parkingData}></ParkingReport>;
};

export default InformeParqueadero;
