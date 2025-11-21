import { useState, useEffect } from 'react'
import { SharedNavbar } from '../components/SharedNavbar'
import { Link } from 'react-router'
import './JudgeDashboard.css'

export function JudgeDashboard() {
    const [username, setUsername] = useState('')
    const [judgeId, setJudgeId] = useState(null)
    const [analytics, setAnalytics] = useState(null)
    const [recentCases, setRecentCases] = useState([])

    useEffect(() => {
        const storedUsername = localStorage.getItem('username')
        const storedJudgeId = localStorage.getItem('userId')
        if (storedUsername) setUsername(storedUsername)
        if (storedJudgeId) {
            setJudgeId(parseInt(storedJudgeId))
            fetchAnalytics(parseInt(storedJudgeId))
            fetchRecentCases(parseInt(storedJudgeId))
        }
    }, [])

    const fetchAnalytics = async (jid) => {
        try {
            const response = await fetch(`http://localhost:8000/api/judges/${jid}/analytics`)
            if (response.ok) {
                const data = await response.json()
                setAnalytics(data)
            }
        } catch (error) {
            console.error('Error fetching analytics:', error)
        }
    }

    const fetchRecentCases = async (jid) => {
        try {
            const response = await fetch(`http://localhost:8000/api/cases/judge/${jid}`)
            if (response.ok) {
                const data = await response.json()
                setRecentCases(data.slice(0, 5))
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
        <div className="judge-dashboard">
            <SharedNavbar role="judge" username={username} />
            
            <div className="dashboard-content">
                <div className="welcome-section">
                    <h1>Welcome, Judge {username}!</h1>
                    <p>"Focused Insights for Fair and Swift Justice"</p>
                </div>

                {analytics && (
                    <div className="analytics-cards">
                        <div className="analytics-card total">
                            <div className="card-icon">⚖️</div>
                            <div className="card-content">
                                <h3>{analytics.total_cases}</h3>
                                <p>Total Cases</p>
                            </div>
                        </div>
                        
                        <div className="analytics-card pending">
                            <div className="card-icon">⏳</div>
                            <div className="card-content">
                                <h3>{analytics.pending_cases}</h3>
                                <p>Pending Cases</p>
                            </div>
                        </div>
                        
                        <div className="analytics-card scheduled">
                            <div className="card-icon">📅</div>
                            <div className="card-content">
                                <h3>{analytics.scheduled_cases}</h3>
                                <p>Scheduled Cases</p>
                            </div>
                        </div>
                        
                        <div className="analytics-card completed">
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
                            <Link to="/judge-cases" className="action-card manage-cases">
                                <div className="card-icon">📋</div>
                                <h3>Manage Cases</h3>
                                <p>View and manage all assigned cases</p>
                            </Link>

                            <Link to="/judge-analytics" className="action-card view-analytics">
                                <div className="card-icon">📊</div>
                                <h3>View Analytics</h3>
                                <p>Detailed performance analytics</p>
                            </Link>
                        </div>
                    </div>

                    <div className="recent-cases-section">
                        <h2>Recent Cases</h2>
                        {recentCases.length === 0 ? (
                            <div className="no-cases">
                                <p>No cases assigned yet.</p>
                            </div>
                        ) : (
                            <div className="cases-list">
                                {recentCases.map(caseItem => (
                                    <div key={caseItem.id} className="case-item">
                                        <div className="case-info">
                                            <h4>{caseItem.title}</h4>
                                            <p className="case-number">#{caseItem.case_number}</p>
                                            <span className={`status-badge ${caseItem.status}`}>
                                                {caseItem.status}
                                            </span>
                                        </div>
                                        <div className="case-schedule">
                                            <p>{formatDate(caseItem.scheduled_date)}</p>
                                            <p>{formatTime(caseItem.scheduled_time)}</p>
                                        </div>
                                    </div>
                                ))}
                                <Link to="/judge-cases" className="view-all-link">
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