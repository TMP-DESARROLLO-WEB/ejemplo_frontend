// 1) Import librarías
import React from 'react';
import ReactDOM from 'react-dom/client';

// 2) Obtener referencia al componente root
const elemento = document.getElementById('root');

// 3) Instruir a React que tome control de este elemento
const root = ReactDOM.createRoot(elemento);

// 4) Crear el componente
function App() {
    
    // return <h1>Hola Mundo</h1>;

    let mensaje = "Hola";
    if (Math.random() < 0.5 )
        mensaje = "Hola Mundo" 
    return <h1>{mensaje}</h1>
}

// 5) Mostrar el componente en la pantalla
root.render(<App />);
