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
        <div className="min-h-screen bg-gray-100 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">CRM System</h1>

            {/* Formulář pro přidání/úpravu */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">{editId ? 'Edit User' : 'Add User'}</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={editId ? editUser : addUser}
                  className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {editId ? 'Update User' : 'Add User'}
                </button>
              </div>
            </div>

            {/* Tabulka uživatelů */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => startEdit(user)}
                          className="text-blue-500 hover:text-blue-700 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="text-red-500 hover:text-red-700"
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
