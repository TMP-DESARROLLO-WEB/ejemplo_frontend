import { useState, useEffect } from 'react'
import { getAllJedi, createJedi, updateJedi, deleteJedi } from './jediService'
import JediForm from './JediForm'
import JediList from './JediList'

export default function App() {
  const [jedis, setJedis]           = useState([])
  const [jediEditar, setJediEditar] = useState(null)   // null = modo crear
  const [mensaje, setMensaje]       = useState('')
  const [cargando, setCargando]     = useState(false)

  // ── Cargar lista al inicio ──────────────────────────────────────────────────
  useEffect(() => {
    cargarJedis()
  }, [])

  async function cargarJedis() {
    setCargando(true)
    try {
      const data = await getAllJedi()
      setJedis(data)
    } catch (e) {
      setMensaje(`Error: ${e.message}`)
    } finally {
      setCargando(false)
    }
  }

  // ── Crear o actualizar ──────────────────────────────────────────────────────
  async function handleGuardado(datos) {
    try {
      if (jediEditar) {
        await updateJedi(jediEditar.id_jedi, datos)
        setMensaje('Jedi actualizado correctamente.')
        setJediEditar(null)
      } else {
        await createJedi(datos)
        setMensaje('Jedi creado correctamente.')
      }
      cargarJedis()
    } catch (e) {
      setMensaje(`Error: ${e.message}`)
    }
  }

  // ── Eliminar ────────────────────────────────────────────────────────────────
  async function handleEliminar(id) {
    if (!confirm('¿Seguro que deseas eliminar este Jedi?')) return
    try {
      await deleteJedi(id)
      setMensaje('Jedi eliminado correctamente.')
      cargarJedis()
    } catch (e) {
      setMensaje(`Error: ${e.message}`)
    }
  }

  // ── Seleccionar para editar ─────────────────────────────────────────────────
  function handleEditar(jedi) {
    setJediEditar(jedi)
    setMensaje('')
  }

  function handleCancelar() {
    setJediEditar(null)
    setMensaje('')
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div>
      <h1>Gestión de Jedis</h1>

      {/* Mensaje de estado */}
      {mensaje && <p>{mensaje}</p>}

      {/* Formulario crear / editar */}
      <JediForm
        jediEditar={jediEditar}
        onGuardado={handleGuardado}
        onCancelar={handleCancelar}
      />

      <hr />

      {/* Tabla de Jedis */}
      <h2>Lista de Jedis</h2>
      <button onClick={cargarJedis}>Recargar lista</button>
      <br /><br />

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <JediList
          jedis={jedis}
          onEditar={handleEditar}
          onEliminar={handleEliminar}
        />
      )}
    </div>
  )
}
