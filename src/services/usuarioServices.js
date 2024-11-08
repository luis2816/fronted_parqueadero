import React from 'react';
import axios from 'axios';
import CONFIG from '../config';

const API_URL = CONFIG.API_URL;
const URL_FRONENDT = CONFIG.URL_FRONENDT;

// Obtener todos los usuarios
export const obtenerUsuarios = async () => {
    try {
        const response = await axios.get(`${API_URL}/usuarios`);
        return response.data; // Axios maneja automáticamente la conversión a JSON
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        throw error; // Propaga el error para que pueda ser manejado por el componente que llama
    }
};

export const obtenerUsuarioPorId = async (id) => {
    try {
        const url = `${API_URL}/usuario?id_usuario=${id}`;
        const response = await axios.get(url);
        return response.data; // Axios maneja automáticamente la conversión a JSON
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        throw error; // Propaga el error para que pueda ser manejado por el componente que llama
    }
};

export const insertUsuario = async (formData) => {
    console.log(formData);
    try {
        const response = await axios.post(`${API_URL}/signup`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data' // Asegúrate de que el tipo de contenido es correcto
            }
        });
        return response.data; // Axios maneja automáticamente la conversión a JSON
    } catch (error) {
        console.error('Error al insertar el usuario:', error);
        throw error; // Propaga el error para que pueda ser manejado por el componente que llama
    }
};

export const updateUsuario = async (userId, formData) => {
    try {
        const response = await axios.put(`${API_URL}/usuario/${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data' // Asegúrate de que el tipo de contenido es correcto
            }
        });
        return response.data; // Axios maneja automáticamente la conversión a JSON
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        throw error; // Propaga el error para que pueda ser manejado por el componente que llama
    }
};

export const obtenerFotoPerfil = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/usuario/${userId}/foto`, {
            responseType: 'blob' // Para obtener la imagen como un blob
        });
        
        // Crear un objeto URL para la imagen
        const imageUrl = URL.createObjectURL(response.data);
        return imageUrl; // Devuelve la URL de la imagen
    } catch (error) {
        console.error('Error al obtener la foto de perfil:', error);
        return null;
    }
};

export const verificarUserEmail = async (email) => {
    try {
        const response = await fetch(`${API_URL}/verificar_email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            throw new Error(`Error de red: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al validar sesión:', error);
        throw error; // Propaga el error para que pueda ser manejado por el componente que llama
    }
};

export const obtenerDetalleCompra_id = async (id_transaccion) => {
    try {
        const url = `${API_URL}/api/webhook/${id_transaccion}`;
        console.log('Fetching data from:', url);
        const response = await axios.get(url);
        
        if (response.status !== 200) {
            throw new Error('Error en la respuesta del servidorxx|');
        }

        return response.data;
    } catch (error) {
        console.error('Error al obtener los detalles de la compra:', error);
        throw new Error('No se pudo obtener los detalles de la compra.');
    }
};
