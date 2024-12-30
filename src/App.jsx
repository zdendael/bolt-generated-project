import React, { useEffect, useState } from 'react'
    import { createClient } from '@supabase/supabase-js'

    const supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_KEY
    )

    function App() {
      const [users, setUsers] = useState([])

      useEffect(() => {
        const fetchUsers = async () => {
          const { data, error } = await supabase
            .from('users')
            .select('*')
          
          if (error) {
            console.error('Error fetching users:', error)
          } else {
            setUsers(data)
          }
        }

        fetchUsers()
      }, [])

      return (
        <div className="min-h-screen bg-gray-100 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">CRM System</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
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
