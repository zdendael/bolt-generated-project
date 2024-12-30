import React, { useEffect, useState } from 'react'
    import { createClient } from '@supabase/supabase-js'

    const supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_KEY
    )

    function App() {
      const [users, setUsers] = useState([])
      const [name, setName] = useState('')
      const [email, setEmail] = useState('')
      const [editId, setEditId] = useState(null)

      // Načtení uživatelů
      const fetchUsers = async () => {
        const { data, error } = await supabase
          .from('users')
          .select('*')
        
        if (error) {
          console.error('Error fetching users:', error)
        } else {
          setUsers(data || [])
        }
      }

      useEffect(() => {
        fetchUsers()
      }, [])

      // Přidání uživatele
      const addUser = async () => {
        if (!name || !email) return

        const { data, error } = await supabase
          .from('users')
          .insert([{ name, email }])
          .select()

        if (error) {
          console.error('Error adding user:', error)
        } else {
          setUsers([...users, ...(data || [])])
          setName('')
          setEmail('')
        }
      }

      // Úprava uživatele
      const editUser = async () => {
        if (!name || !email || !editId) return

        const { data, error } = await supabase
          .from('users')
          .update({ name, email })
          .eq('id', editId)
          .select()

        if (error) {
          console.error('Error updating user:', error)
        } else if (data && data.length > 0) {
          setUsers(users.map(user => user.id === editId ? data[0] : user))
          setName('')
          setEmail('')
          setEditId(null)
        }
      }

      // Smazání uživatele
      const deleteUser = async (id) => {
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', id)

        if (error) {
          console.error('Error deleting user:', error)
        } else {
          setUsers(users.filter(user => user.id !== id))
        }
      }

      // Příprava formuláře pro úpravu
      const startEdit = (user) => {
        setName(user.name)
        setEmail(user.email)
        setEditId(user.id)
      }

      return (
        <div className="container">
          <h1 className="my-4">CRM System</h1>

          {/* Formulář pro přidání/úpravu */}
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="card-title">{editId ? 'Edit User' : 'Add User'}</h2>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                />
              </div>
              <button
                onClick={editId ? editUser : addUser}
                className="btn btn-primary"
              >
                {editId ? 'Update User' : 'Add User'}
              </button>
            </div>
          </div>

          {/* Tabulka uživatelů */}
          <div className="card">
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <button
                          onClick={() => startEdit(user)}
                          className="btn btn-sm btn-primary me-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="btn btn-sm btn-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    }

    export default App
