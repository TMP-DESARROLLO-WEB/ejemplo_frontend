import { useState, useEffect } from 'react'

// Formulario reutilizable para Crear y Editar
export default function JediForm({ jediEditar, onGuardado, onCancelar }) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail]   = useState('')
  const [error, setError]   = useState('')

  // Carga los datos cuando se va a editar
  useEffect(() => {
    if (jediEditar) {
      setNombre(jediEditar.nombre_jedi)
      setEmail(jediEditar.email_jedi)
    } else {
      setNombre('')
      setEmail('')
    }
  }, [jediEditar])

  function handleSubmit(e) {
    e.preventDefault()
    if (!nombre.trim() || !email.trim()) {
      setError('Nombre y email son obligatorios')
      return
    }
    setError('')
    onGuardado({ nombre_jedi: nombre, email_jedi: email })
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{jediEditar ? 'Editar Jedi' : 'Nuevo Jedi'}</h2>

      {error && <p><strong>Error:</strong> {error}</p>}

      <div>
        <label>Nombre: </label>
        <input
          type="text"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Nombre del Jedi"
        />
      </div>

      <div>
        <label>Email: </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="email@jedi.org"
        />
      </div>

      <br />
      <button type="submit">{jediEditar ? 'Actualizar' : 'Crear'}</button>
      {jediEditar && (
        <button type="button" onClick={onCancelar}>
          Cancelar
        </button>
      )}
    </form>
  )
}
