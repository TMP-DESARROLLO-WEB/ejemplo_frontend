// Lista de Jedis con botones Editar y Eliminar
export default function JediList({ jedis, onEditar, onEliminar }) {
  if (jedis.length === 0) {
    return <p>No hay Jedis registrados.</p>
  }

  return (
    <table border="1" cellPadding="8">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {jedis.map(jedi => (
          <tr key={jedi.id_jedi}>
            <td>{jedi.id_jedi}</td>
            <td>{jedi.nombre_jedi}</td>
            <td>{jedi.email_jedi}</td>
            <td>
              <button onClick={() => onEditar(jedi)}>Editar</button>
              {' '}
              <button onClick={() => onEliminar(jedi.id_jedi)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
