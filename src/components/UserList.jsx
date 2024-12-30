import { useEffect, useState } from 'react'
    import { supabase } from '../App.jsx'

    export default function UserList() {
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
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )
    }
