import React from 'react';
import CONFIG from '../../config';

const API_URL = CONFIG.API_URL;

export const updatePassword = async (userId, data) => {
    try {
        const response = await fetch(`${API_URL}/usuario/cambiar_password/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', // Añadir encabezado adecuado
            },
            body: JSON.stringify(data), // Convertir data a JSON
        });

        // Verificar si la respuesta es exitosa (status 200-299)
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Network response was not ok');
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error al actualizar contraseña:', error);
        throw error; // Propaga el error para que pueda ser manejado por el componente que llama
    }
};
