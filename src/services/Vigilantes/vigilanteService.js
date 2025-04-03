import React from 'react';
import axios from 'axios';
import CONFIG from '../../config';

const API_URL = CONFIG.API_URL;

// Obtener todos los vigilantes
export const obtenerVigilantes = async (id_admin) => {
    try {
        const response = await axios.get(`${API_URL}/vigilantes?id_admin=${id_admin}`);
        return response.data; // Axios maneja automáticamente la conversión a JSON
    } catch (error) {
        console.error('Error al obtener los vigilantes:', error);
        throw error; // Propaga el error para que pueda ser manejado por el componente que llama
    }
};

export const insertVigilante = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/signupVigilante`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data' // Asegúrate de que el tipo de contenido es correcto
            }
        });
        return response.data; // Axios maneja automáticamente la conversión a JSON
    } catch (error) {
        console.error('Error al insertar el vigilante:', error);
        throw error; // Propaga el error para que pueda ser manejado por el componente que llama
    }
};


export const updateVigilante = async (userId, formData) => {
    try {
        const response = await axios.put(`${API_URL}/vigilante/${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data' // Asegúrate de que el tipo de contenido es correcto
            }
        });
        return response.data; // Axios maneja automáticamente la conversión a JSON
    } catch (error) {
        console.error('Error al actualizar el vigilante:', error);
        throw error; // Propaga el error para que pueda ser manejado por el componente que llama
    }
};


