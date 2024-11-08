import React from 'react';
import CONFIG from '../../config';
import axios from 'axios';

const API_URL = CONFIG.API_URL;

export const insertConjunto = async (detalle) => {
    try {
        const response = await fetch(`${API_URL}/insertConjunto`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(detalle),
        });

        // Verificar si la respuesta es exitosa (status 200)
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Network response was not ok');
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error al insertar el usuario:', error);
        throw error; // Propaga el error para que pueda ser manejado por el componente que llama
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
