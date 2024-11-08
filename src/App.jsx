import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import AppRoutes from './routes/routes';

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppRoutes /> {/* Aquí se renderizan las rutas */}
      </Router>
    </Provider>
  );
}
