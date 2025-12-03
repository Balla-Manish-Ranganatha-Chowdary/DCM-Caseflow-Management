import { Navigate } from 'react-router'
import { useEffect, useState } from 'react'

export function ProtectedRoute({ children, allowedRoles }) {
    const [isChecking, setIsChecking] = useState(true)
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token')
            const role = localStorage.getItem('role')

            // Not logged in
            if (!token || !role) {
                setIsAuthorized(false)
                setIsChecking(false)
                return
            }

            // Check if user's role is allowed
            if (allowedRoles.includes(role)) {
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
            
            setIsChecking(false)
        }

        checkAuth()
    }, [allowedRoles])

    if (isChecking) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                fontSize: '18px'
            }}>
                Loading...
            </div>
        )
    }

    if (!isAuthorized) {
        // Redirect to home if not authorized
        return <Navigate to="/" replace />
    }

    return children
}
