import { useEffect, useState } from 'react'
import { usersApi } from './api'

const emptyUser = { name: '', email: '', phone: '', city: '' }

export default function App() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(emptyUser)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function loadUsers() {
    setLoading(true)
    try { setUsers(await usersApi.list()) } catch (err) { setError(err.message) } finally { setLoading(false) }
  }
  useEffect(() => { loadUsers() }, [])
  function changeField(event) { setForm({ ...form, [event.target.name]: event.target.value }) }
  function resetForm() { setForm(emptyUser); setEditingId(null) }
  async function submit(event) {
    event.preventDefault(); setError(''); setMessage(''); setSubmitting(true)
    try {
      if (editingId) { await usersApi.update(editingId, form); setMessage('User updated successfully.') }
      else { await usersApi.create(form); setMessage('User added successfully.') }
      resetForm(); await loadUsers()
    } catch (err) { setError(err.message) } finally { setSubmitting(false) }
  }
  function editUser(user) { setForm({ name: user.name, email: user.email, phone: user.phone, city: user.city }); setEditingId(user.id); setMessage(''); setError('') }
  async function deleteUser(user) {
    if (!window.confirm(`Delete ${user.name}?`)) return
    setError(''); setMessage('')
    try { await usersApi.remove(user.id); setMessage('User deleted successfully.'); if (editingId === user.id) resetForm(); await loadUsers() } catch (err) { setError(err.message) }
  }
  return <main className="page">
    <section className="intro"><p className="eyebrow">USER DIRECTORY</p><h1>User details, simply managed.</h1><p>Add, update, and remove contact details from one clean workspace.</p></section>
    <div className="layout">
      <section className="card form-card"><div className="section-heading"><h2>{editingId ? 'Edit user' : 'Add a user'}</h2><span>{editingId ? 'UPDATE' : 'NEW'}</span></div><form onSubmit={submit}>
        <label>Name<input name="name" value={form.name} onChange={changeField} minLength="2" required /></label><label>Email<input name="email" type="email" value={form.email} onChange={changeField} required /></label><label>Phone<input name="phone" value={form.phone} onChange={changeField} minLength="7" required /></label><label>City<input name="city" value={form.city} onChange={changeField} minLength="2" required /></label>
        <div className="form-actions"><button type="submit" disabled={submitting}>{submitting ? 'Saving…' : editingId ? 'Save changes' : 'Add user'}</button>{editingId && <button type="button" className="secondary" onClick={resetForm}>Cancel</button>}</div>
      </form></section>
      <section className="card list-card"><div className="section-heading"><h2>All users</h2><span>{users.length} TOTAL</span></div>{message && <p className="notice success">{message}</p>}{error && <p className="notice error">{error}</p>}{loading ? <p className="empty">Loading users…</p> : users.length === 0 ? <p className="empty">No users yet. Add the first one using the form.</p> : <div className="user-list">{users.map(user => <article className="user" key={user.id}><div className="avatar">{user.name.slice(0, 1).toUpperCase()}</div><div className="details"><h3>{user.name}</h3><p>{user.email}</p><p>{user.phone} · {user.city}</p></div><div className="row-actions"><button className="text-button" onClick={() => editUser(user)}>Edit</button><button className="text-button danger" onClick={() => deleteUser(user)}>Delete</button></div></article>)}</div>}</section>
    </div>
  </main>
}
