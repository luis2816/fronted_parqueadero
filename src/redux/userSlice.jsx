import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { obtenerUsuarioPorId } from '../services/usuarioServices';
import CONFIG from '../config';

const API_URL = CONFIG.API_URL;

const initialState = {
  email: localStorage.getItem('userEmail') || null,
  primer_nombre: localStorage.getItem('primer_nombre') || null,
  primer_apellido: localStorage.getItem('primer_apellido') || null,
  foto_perfil_url: localStorage.getItem('foto_perfil_url') || undefined,
  id: localStorage.getItem('id') ? Number(localStorage.getItem('id')) : null,
  cantidad_licencias: localStorage.getItem('cantidad_licencias') ? Number(localStorage.getItem('cantidad_licencias')) : null,
  loading: false,
  error: null,
};

// Thunk asincrónico para obtener datos del usuario desde un servicio
export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (userId) => {
    const response = await obtenerUsuarioPorId(userId);
    const userImage = API_URL + response.foto_perfil_url + `?timestamp=${new Date().getTime()}`;
    // Extraer solo los datos necesarios
    const userData = {
      email: response.email,
      primer_nombre: response.nombre,
      primer_apellido: response.apellido,
      foto_perfil_url: userImage,
      id: response.id,
      cantidad_licencias: response.cantidad_licencia,
    };

    return userData;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.email = null;
      state.primer_nombre = null;
      state.primer_apellido = null;
      state.foto_perfil_url = undefined;
      state.id = null;
      state.cantidad_licencias = null;
      localStorage.removeItem('userEmail');
      localStorage.removeItem('primer_nombre');
      localStorage.removeItem('primer_apellido');
      localStorage.removeItem('foto_perfil_url');
      localStorage.removeItem('id');
      localStorage.removeItem('cantidad_licencias');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        const { email, primer_nombre, primer_apellido, foto_perfil_url, id, cantidad_licencias } = action.payload;
        state.email = email;
        state.primer_nombre = primer_nombre;
        state.primer_apellido = primer_apellido;
        state.foto_perfil_url = foto_perfil_url;
        state.id = id;
        state.loading = false;
        state.cantidad_licencias = cantidad_licencias;

        // Guardar los datos en localStorage
        localStorage.setItem('userEmail', email);
        localStorage.setItem('primer_nombre', primer_nombre);
        localStorage.setItem('primer_apellido', primer_apellido);
        localStorage.setItem('foto_perfil_url', foto_perfil_url || '');
        localStorage.setItem('id', id.toString());
        localStorage.setItem('cantidad_licencias', cantidad_licencias.toString());
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al obtener los datos del usuario';
      });
  },
});

export const { clearUser } = userSlice.actions;

export default userSlice.reducer;
