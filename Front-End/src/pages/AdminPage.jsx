import { useState, useEffect } from 'react'
import { SharedNavbar } from '../components/SharedNavbar'
import { useNavigate } from 'react-router'

export function AdminPage() {
    const [username, setUsername] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const storedUsername = localStorage.getItem('username')
        if (storedUsername) {
            setUsername(storedUsername)
        }
        // Redirect to new admin dashboard
        navigate('/admin-dashboard')
    }, [navigate])

    return (
        <div>
            <SharedNavbar role="admin" username={username} />
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h1>Redirecting to Admin Dashboard...</h1>
            </div>
        </div>
    )
}