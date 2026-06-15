// ─── Cambia esta variable para apuntar a tu servidor Flask ───────────────────
const URL_BASE = 'https://congenial-engine-4jv5qj6xw6q5c7575-5000.app.github.dev'

// ─── GET todos ───────────────────────────────────────────────────────────────
export async function getAllJedi() {
  const res = await fetch(`${URL_BASE}/jedi`)
  if (!res.ok) throw new Error('Error al obtener los Jedis')
  return res.json()
}

// ─── GET uno ─────────────────────────────────────────────────────────────────
export async function getJedi(id) {
  const res = await fetch(`${URL_BASE}/jedi/${id}`)
  if (!res.ok) throw new Error('Jedi no encontrado')
  return res.json()
}

// ─── POST ─────────────────────────────────────────────────────────────────────
export async function createJedi(data) {
  const res = await fetch(`${URL_BASE}/jedi`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al crear el Jedi')
  return res.json()
}

// ─── PUT ──────────────────────────────────────────────────────────────────────
export async function updateJedi(id, data) {
  const res = await fetch(`${URL_BASE}/jedi/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al actualizar el Jedi')
  return res.json()
}

// ─── DELETE ───────────────────────────────────────────────────────────────────
export async function deleteJedi(id) {
  const res = await fetch(`${URL_BASE}/jedi/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar el Jedi')
  return res.json()
}
