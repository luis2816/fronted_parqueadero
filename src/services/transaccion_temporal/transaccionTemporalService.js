import React from 'react';
import axios from 'axios';
import CONFIG from '../../config';

const API_URL = CONFIG.API_URL;

export const insertTransaccion_temporal = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/insertTransaccionTemporal`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data; // Axios maneja automáticamente la conversión a JSON
    } catch (error) {
        console.error('Error al insertar la transacción temporal:', error);
        throw error; // Propaga el error para que pueda ser manejado por el componente que llama
    }
};
