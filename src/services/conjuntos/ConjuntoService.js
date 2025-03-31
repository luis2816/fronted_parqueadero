import React from 'react';
import CONFIG from '../../config';
import axios from 'axios';

const API_URL = CONFIG.API_URL;

export const insertConjunto = async (detalle) => {
    try {
        const response = await fetch(`${API_URL}/insertConjunto`, {
            method: 'POST',
            body: detalle, // Enviar FormData directamente
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Error en la respuesta del servidor');
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error al insertar el conjunto:', error);
        throw error;
    }
};

export const updateConjunto = async (conjuntoId, detalle) => {
    try {
        const response = await fetch(`${API_URL}/updateConjunto/${conjuntoId}`, {
            method: 'PUT',
            body: detalle, // Enviar FormData directamente
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Error en la respuesta del servidor');
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error al actualizar el conjunto:', error);
        throw error;
    }
};

export const obtenerConjuntos = async (id_usuario) => {
    try {
        const url = `${API_URL}/conjuntos/${id_usuario}`;
        const response = await axios.get(url);
        return response.data; // Axios maneja automáticamente la conversión a JSON
    } catch (error) {
        console.error('Error al obtener los conjuntos:', error);
        throw error; // Propaga el error para que pueda ser manejado por el componente que llama
    }
};

export const obtenerTotalConjuntos = async (id_usuario) => {
    try {
        const url = `${API_URL}/conjuntos/total?id_usuario=${id_usuario}`;
        const response = await axios.get(url);
        return response.data; // Axios maneja automáticamente la conversión a JSON
    } catch (error) {
        console.error('Error al obtener total de conjuntos:', error);
        throw error; // Propaga el error para que pueda ser manejado por el componente que llama
    }
};


export const getConjuntoImage = (filename) => {
    return `${API_URL}/${filename}`;
  };