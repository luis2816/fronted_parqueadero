import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

// Configuración del store
const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// Exportar el store
export default store;
