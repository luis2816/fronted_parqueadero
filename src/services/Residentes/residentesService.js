import React from 'react';
import axios from 'axios';
import CONFIG from '../../config';

const API_URL = CONFIG.API_URL;

// Obtener todos los residentes
export const obtenerResidentes = async (id_admin) => {
    try {
        const response = await axios.get(`${API_URL}/residentes?id_admin=${id_admin}`);
        return response.data; // Axios maneja automáticamente la conversión a JSON
    } catch (error) {
        console.error('Error al obtener los residentes:', error);
        throw error; // Propaga el error para que pueda ser manejado por el componente que llama
    }
};

export const insertResidente = async (formData) => {
    console.log(formData);
    try {
        const response = await axios.post(`${API_URL}/residente`, formData, {
            headers: {
                'Content-Type': 'application/json' // Enviar datos en formato JSON
            }
        });
        return response.data; // Axios maneja automáticamente la conversión de JSON
    } catch (error) {
        console.error('Error al insertar el residente:', error);
        throw error; // Propaga el error para que pueda ser manejado externamente
    }
};

export const updateResidente = async (userId, formData) => {
    try {
        const response = await axios.put(`${API_URL}/residente/${userId}`, formData, {
            headers: {
                'Content-Type': 'application/json' // Enviar datos en formato JSON
            }
        });
        return response.data; // Axios maneja automáticamente la conversión a JSON
    } catch (error) {
        console.error('Error al actualizar el residente:', error);
        throw error; // Propaga el error para que pueda ser manejado por el componente que llama
    }
};


