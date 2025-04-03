import React from 'react';
import axios from 'axios';
import CONFIG from '../../config';

const API_URL = CONFIG.API_URL;

// Obtener estado de  parqueadero por conjunto
export const obtenerEstadoarqueadero= async (id_conjunto) => {
    try {
        const response = await axios.get(`${API_URL}/getDetalleParking/${id_conjunto}`);
        return response.data; // Axios maneja automáticamente la conversión a JSON
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        throw error; // Propaga el error para que pueda ser manejado por el componente que llama
    }
};
