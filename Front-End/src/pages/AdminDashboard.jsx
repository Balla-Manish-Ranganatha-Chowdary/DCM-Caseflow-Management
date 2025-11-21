import { useState, useEffect } from 'react'
import { SharedNavbar } from '../components/SharedNavbar'
import { Link } from 'react-router'
import './AdminDashboard.css'

export function AdminDashboard() {
    const [username, setUsername] = useState('')
    const [analytics, setAnalytics] = useState(null)

    useEffect(() => {
        const storedUsername = localStorage.getItem('username')
        if (storedUsername) setUsername(storedUsername)
        fetchAnalytics()
    }, [])

    const fetchAnalytics = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/admins/analytics')
            if (response.ok) {
                const data = await response.json()
                setAnalytics(data)
            }
        } catch (error) {
            console.error('Error fetching analytics:', error)
        }
    }

    return (
        <div className="admin-dashboard">
            <SharedNavbar role="admin" username={username} />
            
            <div className="dashboard-content">
                <div className="welcome-section">
                    <h1>Admin Dashboard</h1>
                    <p>System-wide management and analytics</p>
                </div>

                {analytics && (
                    <div className="analytics-cards">
                        <div className="analytics-card total-cases">
                            <div className="card-icon">⚖️</div>
                            <div className="card-content">
                                <h3>{analytics.total_cases}</h3>
                                <p>Total Cases</p>
                            </div>
                        </div>
                        
                        <div className="analytics-card total-users">
                            <div className="card-icon">👥</div>
                            <div className="card-content">
                                <h3>{analytics.total_users}</h3>
                                <p>Total Users</p>
                            </div>
                        </div>
                        
                        <div className="analytics-card total-judges">
                            <div className="card-icon">👨‍⚖️</div>
                            <div className="card-content">
                                <h3>{analytics.total_judges}</h3>
                                <p>Total Judges</p>
                            </div>
                        </div>
                        
                        <div className="analytics-card pending-cases">
                            <div className="card-icon">⏳</div>
                            <div className="card-content">
                                <h3>{analytics.pending_cases}</h3>
                                <p>Pending Cases</p>
                            </div>
                        </div>
                        
                        <div className="analytics-card scheduled-cases">
                            <div className="card-icon">📅</div>
                            <div className="card-content">
                                <h3>{analytics.scheduled_cases}</h3>
                                <p>Scheduled Cases</p>
                            </div>
                        </div>
                        
                        <div className="analytics-card completed-cases">
                            <div className="card-icon">✅</div>
                            <div className="card-content">
                                <h3>{analytics.completed_cases}</h3>
                                <p>Completed Cases</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="dashboard-grid">
                    <div className="action-section">
                        <h2>Quick Actions</h2>
                        <div className="action-cards">
                            <Link to="/admin-analytics" className="action-card view-analytics">
                                <div className="card-icon">📊</div>
                                <div className="card-content">
                                    <h3>View Analytics</h3>
                                    <p>Detailed system analytics and reports</p>
                                </div>
                            </Link>

                            <Link to="/admin-manage-records" className="action-card manage-records">
                                <div className="card-icon">🗄️</div>
                                <div className="card-content">
                                    <h3>Manage Records</h3>
                                    <p>Modify and delete database records</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="system-status">
                        <h2>System Status</h2>
                        <div className="status-items">
                            <div className="status-item">
                                <div className="status-indicator active"></div>
                                <div className="status-info">
                                    <h4>Database Connection</h4>
                                    <p>Active and healthy</p>
                                </div>
                            </div>
                            
                            <div className="status-item">
                                <div className="status-indicator active"></div>
                                <div className="status-info">
                                    <h4>Scheduling Algorithm</h4>
                                    <p>Running optimally</p>
                                </div>
                            </div>
                            
                            <div className="status-item">
                                <div className="status-indicator active"></div>
                                <div className="status-info">
                                    <h4>File Upload System</h4>
                                    <p>Operational</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}