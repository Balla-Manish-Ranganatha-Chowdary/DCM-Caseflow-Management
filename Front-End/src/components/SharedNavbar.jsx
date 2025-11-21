import { Link, useNavigate, useLocation } from 'react-router'
import './SharedNavbar.css'

export function SharedNavbar({ role, username }) {
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        localStorage.clear()
        navigate('/')
    }

    const getNavLinks = () => {
        switch (role) {
            case 'user':
                return [
                    { path: '/user-dashboard', label: 'Dashboard' },
                    { path: '/user-file-case', label: 'File Case' },
                    { path: '/user-check-status', label: 'Check Status' }
                ]
            case 'judge':
                return [
                    { path: '/judge-dashboard', label: 'Dashboard' },
                    { path: '/judge-cases', label: 'My Cases' },
                    { path: '/judge-analytics', label: 'Analytics' }
                ]
            case 'admin':
                return [
                    { path: '/admin-dashboard', label: 'Dashboard' },
                    { path: '/admin-analytics', label: 'Analytics' },
                    { path: '/admin-manage-records', label: 'Manage Records' }
                ]
            default:
                return []
        }
    }

    const navLinks = getNavLinks()

    return (
        <nav className="shared-navbar">
            <Link to="/" className="navbar-brand">
                <img src="/logo.png" alt="DCM Logo" className="navbar-logo" />
                <h1>DCM System</h1>
            </Link>

            <div className="navbar-nav">
                {navLinks.map(link => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>

            <div className="user-info">
                <div className="user-avatar">
                    {username ? username.charAt(0).toUpperCase() : 'U'}
                </div>
                <span>Welcome, {username || 'User'}</span>
                <button onClick={handleLogout} className="logout-btn">
                    Logout
                </button>
            </div>
        </nav>
    )
}