import { useState, useEffect } from 'react'
import { SharedNavbar } from '../components/SharedNavbar'
import { Link } from 'react-router'
import './UserDashboard.css'

export function UserDashboard() {
    const [username, setUsername] = useState('')
    const [userId, setUserId] = useState(null)
    const [recentCases, setRecentCases] = useState([])

    useEffect(() => {
        const storedUsername = localStorage.getItem('username')
        const storedUserId = localStorage.getItem('userId')
        if (storedUsername) setUsername(storedUsername)
        if (storedUserId) {
            setUserId(parseInt(storedUserId))
            fetchRecentCases(parseInt(storedUserId))
        }
    }, [])

    const fetchRecentCases = async (uid) => {
        try {
            const response = await fetch(`http://localhost:8000/api/cases/user/${uid}`)
            if (response.ok) {
                const data = await response.json()
                setRecentCases(data.slice(0, 3)) // Show only 3 recent cases
            }
        } catch (error) {
            console.error('Error fetching cases:', error)
        }
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Not scheduled'
        return new Date(dateStr).toLocaleDateString()
    }

    const formatTime = (timeStr) => {
        if (!timeStr) return ''
        return timeStr.substring(0, 5)
    }

    return (
        <div className="user-dashboard">
            <SharedNavbar role="user" username={username} />
            
            <div className="dashboard-content">
                <div className="welcome-section">
                    <h1>Welcome back, {username}!</h1>
                    <p>Manage your legal cases efficiently with our intelligent scheduling system</p>
                </div>

                <div className="dashboard-grid">
                    <div className="action-cards">
                        <Link to="/user-file-case" className="action-card file-case">
                            <div className="card-icon">📝</div>
                            <h3>File New Case</h3>
                            <p>Submit a new legal case with automatic scheduling</p>
                        </Link>

                        <Link to="/user-check-status" className="action-card check-status">
                            <div className="card-icon">📊</div>
                            <h3>Check Status</h3>
                            <p>View all your cases and their current status</p>
                        </Link>
                    </div>

                    <div className="recent-cases-section">
                        <h2>Recent Cases</h2>
                        {recentCases.length === 0 ? (
                            <div className="no-cases">
                                <p>No cases filed yet.</p>
                                <Link to="/user-file-case" className="file-first-case-btn">
                                    File Your First Case
                                </Link>
                            </div>
                        ) : (
                            <div className="cases-preview">
                                {recentCases.map(caseItem => (
                                    <div key={caseItem.id} className="case-preview-card">
                                        <div className="case-header">
                                            <h4>{caseItem.title}</h4>
                                            <span className={`status-badge ${caseItem.status}`}>
                                                {caseItem.status}
                                            </span>
                                        </div>
                                        <p className="case-number">Case #{caseItem.case_number}</p>
                                        <div className="case-details">
                                            <span>Complexity: {caseItem.complexity}</span>
                                            <span>
                                                Next Hearing: {formatDate(caseItem.scheduled_date)} 
                                                {caseItem.scheduled_time && ` at ${formatTime(caseItem.scheduled_time)}`}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <Link to="/user-check-status" className="view-all-cases">
                                    View All Cases →
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}