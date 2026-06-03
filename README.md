# Consumir servicios web desde react

## Requisitos

Tener instalado:

- [Node.js](https://nodejs.org/) v18 o superior
- npm (incluido con Node.js)

Verifica tu instalación:

```bash
node --version
npm --version
```

---

## Crear el proyecto

```bash
# 1. Crear el proyecto con la plantilla de React
npm create vite@latest mi-app -- --template react

# 2. Entrar a la carpeta
cd mi-app

# 3. Instalar dependencias
npm install

# 4. Correr aplicación
npm run dev

```

---

##  Con los archivos proporcionados, asegúrate que así quede la estructura del proyecto:

Se sustituyen los contenidos de `main.jsx` y `App.jsx` dentro de `src/`
```
mi-app/
├── public/             # Archivos estáticos públicos
├── src/
│   ├── imagenes/       # Carpeta/directorio con 3 imágenes
│   ├── main.jsx        # Punto de entrada
│   ├── JediForm.jsx    # Forma para agregar o crear jedis
│   ├── JediList.jsx    # Lista de Jedis
│   ├── jediService.js  # Funciones para llamar los servicios web desde react
│   └── App.jsx         # Componente principal
├── index.html          # HTML raíz con el div#root
├── vite.config.js      # Configuración de Vite
└── package.json        # Dependencias y scripts
```

## Este proyecto está diseñado para trabajar con los servicios web de otro repositorio

Repositorio

https://github.com/CLA-TC2005B-FJ2026/react_consumir_ws

Por lo que es necesario **reemplazar** el contenido de la variable `URL_BASE` en `jediService.js`

---

# Explicación de la aplicación

## ¿Qué hace esta aplicación?

Esta aplicación es un ejemplo completo de cómo conectar un **frontend en React** con un **backend de servicios web en Flask**. Permite realizar las operaciones CRUD (Crear, Leer, Actualizar y Eliminar) sobre una tabla de Jedis almacenada en una base de datos MySQL.

---

## Arquitectura general

```
┌─────────────────────┐        HTTP / JSON         ┌──────────────────────┐
│   Frontend (React)  │  ───────────────────────►  │   Backend (Flask)    │
│   localhost:5173    │  ◄──────────────────────   │   localhost:5000     │
└─────────────────────┘                            └──────────┬───────────┘
                                                              │
                                                   ┌──────────▼───────────┐
                                                   │   MySQL (testdb)     │
                                                   │   tabla: jedi        │
                                                   └──────────────────────┘
```

El frontend **nunca toca la base de datos directamente**. Siempre le habla al backend a través de peticiones HTTP, y el backend es quien consulta MySQL. Esta separación de responsabilidades es la base de cualquier aplicación web moderna.

---

## Estructura de archivos del frontend

```
jedi-app/
├── index.html                  ← Punto de entrada HTML
├── package.json                ← Dependencias del proyecto
├── vite.config.js              ← Configuración de Vite
└── src/
    ├── main.jsx                ← Monta la app en el DOM
    ├── App.jsx                 ← Componente principal (orquestador)
    ├── jediService.js          ← Todas las llamadas HTTP al backend
    ├── JediForm.jsx            ← Formulario para crear y editar
    └── JediList.jsx            ← Tabla con la lista de Jedis
```

---

## Explicación de cada archivo

### `jediService.js`: La capa de comunicación con el backend

Este archivo centraliza **todas las llamadas HTTP** al servidor Flask. Es el único lugar del proyecto donde se usa `fetch`.

```js
const URL_BASE = 'http://localhost:5000'
```

Esta variable es clave: si el backend cambia de servidor o puerto, **solo modificas esta línea** y toda la app se actualiza. No tienes que buscar URLs por todo el código.

Cada función del servicio corresponde a una operación CRUD:

| Función          | Método HTTP | Ruta          | Descripción              |
|------------------|-------------|---------------|--------------------------|
| `getAllJedi()`    | GET         | `/jedi`       | Obtiene todos los Jedis  |
| `getJedi(id)`    | GET         | `/jedi/:id`   | Obtiene uno por ID       |
| `createJedi()`   | POST        | `/jedi`       | Crea un nuevo Jedi       |
| `updateJedi()`   | PUT         | `/jedi/:id`   | Actualiza un Jedi        |
| `deleteJedi()`   | DELETE      | `/jedi/:id`   | Elimina un Jedi          |

**¿Por qué separar esto en su propio archivo?**  
Imagina que mañana cambias de `fetch` a `axios`, o que el backend cambia sus rutas. Si las llamadas estuvieran dentro de los componentes, tendrías que modificar muchos archivos. Al tenerlas aquí, **cambias en un solo lugar**.

---

### `JediForm.jsx`: Formulario reutilizable

Este componente tiene **dos modos de operación**:

- **Modo Crear:** cuando no se le pasa ningún Jedi, muestra el formulario vacío.
- **Modo Editar:** cuando se le pasa un Jedi (via prop `jediEditar`), rellena el formulario con sus datos.

```jsx
export default function JediForm({ jediEditar, onGuardado, onCancelar }) {
```

Recibe tres **props**:

| Prop          | Tipo     | Descripción                                           |
|---------------|----------|-------------------------------------------------------|
| `jediEditar`  | objeto   | El Jedi a editar, o `null` si se está creando uno nuevo |
| `onGuardado`  | función  | Se llama cuando el usuario envía el formulario        |
| `onCancelar`  | función  | Se llama cuando el usuario cancela la edición         |

Nota que el componente **no llama al servicio directamente**. Solo recolecta los datos del formulario y los entrega hacia arriba a través de `onGuardado`. Quien decide qué hacer con esos datos es `App.jsx`.

> Esto se conoce como el patrón **"elevar el estado"** (*lifting state up*). El componente hijo avisa al padre, y el padre toma la decisión.

El hook `useEffect` se usa para cargar los datos del Jedi en el formulario cuando se va a editar:

```jsx
useEffect(() => {
  if (jediEditar) {
    setNombre(jediEditar.nombre_jedi)
    setEmail(jediEditar.email_jedi)
  } else {
    setNombre('')
    setEmail('')
  }
}, [jediEditar])  // ← Se ejecuta cada vez que cambia jediEditar
```

---

### `JediList.jsx`: Tabla de resultados

Componente simple que recibe una lista de Jedis y la presenta en una tabla HTML.

```jsx
export default function JediList({ jedis, onEditar, onEliminar }) {
```

| Prop         | Tipo     | Descripción                                        |
|--------------|----------|----------------------------------------------------|
| `jedis`      | arreglo  | La lista de Jedis a mostrar                        |
| `onEditar`   | función  | Se llama con el Jedi seleccionado al presionar Editar   |
| `onEliminar` | función  | Se llama con el ID del Jedi al presionar Eliminar  |

Al igual que `JediForm`, este componente **no hace fetch ni modifica estado**. Solo muestra datos y notifica eventos. Esta característica lo convierte en un componente **presentacional** (también llamado *dumb component*).

---

### `App.jsx`

Es el componente central que conecta todo. Aquí vive el estado principal de la aplicación y aquí se decide qué hacer cuando ocurre una acción.

```jsx
const [jedis, setJedis]           = useState([])   // lista completa
const [jediEditar, setJediEditar] = useState(null)  // null = modo crear
const [mensaje, setMensaje]       = useState('')    // mensajes de éxito o error
const [cargando, setCargando]     = useState(false) // indicador de carga
```

El flujo completo de una operación luce así (ejemplo: eliminar un Jedi):

```
Usuario presiona "Eliminar"
        │
        ▼
JediList llama onEliminar(id)
        │
        ▼
App.jsx ejecuta handleEliminar(id)
        │
        ▼
jediService.deleteJedi(id)  →  DELETE /jedi/:id  →  Flask  →  MySQL
        │
        ▼
App.jsx recarga la lista con cargarJedis()
        │
        ▼
JediList se vuelve a renderizar con los datos actualizados
```

---

## El flujo de datos en React (resumen visual)

```
         App.jsx
        /       \
       /         \
JediForm        JediList
  ▲   │            ▲
  │   │            │
props  eventos    props
```

- Los datos bajan de padre a hijo a través de **props**.
- Los eventos suben de hijo a padre a través de **funciones (callbacks)**.
- El estado siempre vive en el componente más alto que lo necesite.

---


## Glosario rápido

| Término | Significado |
|---|---|
| **CRUD** | Create, Read, Update, Delete: las 4 operaciones básicas sobre datos |
| **REST** | Estilo de arquitectura para servicios web que usa métodos HTTP (GET, POST, PUT, DELETE) |
| **fetch** | Función nativa de JavaScript para hacer peticiones HTTP |
| **CORS** | Cross-Origin Resource Sharing: mecanismo que controla qué orígenes pueden acceder a un servidor |
| **prop** | Dato que un componente padre le pasa a un componente hijo en React |
| **estado (state)** | Datos internos de un componente que, al cambiar, provocan que React vuelva a renderizar la UI |
| **hook** | Función especial de React (comienza con `use`) que permite usar características como estado o efectos |
| **useEffect** | Hook que ejecuta código cuando cambia una dependencia o cuando el componente se monta/desmonta |
