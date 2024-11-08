import React from 'react';
import axios from 'axios'; // Importa axios
import CONFIG from '../../config';

const baseUrl = CONFIG.API_URL;
const loginEndpoint = '/login';

// Función de login
export const loginService = async (email, password) => {
  try {
    const response = await axios.post(`${baseUrl}${loginEndpoint}`, {
      email,
      password,
    });

    return response.data; // Retorna los datos de la respuesta
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Manejo de errores específicos de axios
      console.error('Error al validar sesión:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error de red');
    } else {
      // Manejo de errores generales
      console.error('Error al validar sesión:', error);
      throw error;
    }
  }
};
