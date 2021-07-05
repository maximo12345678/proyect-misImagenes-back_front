import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css'
//desde aca usamos el stateProvider, para que todos los compoenntes de la app accedan a los datos
import { StateProvider } from './StateProvider'
//reducer no necesita llaves porque lo exportamos por defecto, initialState lo exportamos por nombre si necesita llaves
import reducer, { initialState } from './reducer'

ReactDOM.render(
  <React.StrictMode>
    <StateProvider initialState={initialState} reducer={reducer}>
      <App />
    </StateProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

