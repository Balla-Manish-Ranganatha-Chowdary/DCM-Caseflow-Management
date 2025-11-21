import { useState, useEffect } from 'react'
import { SharedNavbar } from '../components/SharedNavbar'
import './AdminAnalyticsPage.css'

export function AdminAnalyticsPage() {
    const [username, setUsername] = useState('')
    const [analytics, setAnalytics] = useState(null)
    const [cases, setCases] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedUsername = localStorage.getItem('username')
        if (storedUsername) setUsername(storedUsername)
        fetchAnalytics()
        fetchCases()
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

    const fetchCases = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/cases/')
            if (response.ok) {
                const data = await response.json()
                setCases(data)
            }
        } catch (error) {
            console.error('Error fetching cases:', error)
        } finally {
            setLoading(false)
        }
    }

    const getComplexityStats = () => {
        const stats = {
            simple: 0,
            moderate: 0,
            complex: 0,
            highly_complex: 0
        }
        
        cases.forEach(caseItem => {
            stats[caseItem.complexity]++
        })
        
        return stats
    }

    const getStatusStats = () => {
        const stats = {
            pending: 0,
            scheduled: 0,
            in_progress: 0,
            completed: 0,
            adjourned: 0
        }
        
        cases.forEach(caseItem => {
            stats[caseItem.status]++
        })
        
        return stats
    }

    if (loading) {
        return (
            <div className="admin-analytics-page">
                <SharedNavbar role="admin" username={username} />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading analytics...</p>
                </div>
            </div>
        )
    }

    const complexityStats = getComplexityStats()
    const statusStats = getStatusStats()

    return (
        <div className="admin-analytics-page">
            <SharedNavbar role="admin" username={username} />
            
            <div className="analytics-content">
                <div className="page-header">
                    <h1>System Analytics</h1>
                    <p>Comprehensive insights into the case management system</p>
                </div>

                {analytics && (
                    <>
                        <div className="analytics-overview">
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
                            
                            <div className="analytics-card cases-month">
                                <div className="card-icon">📈</div>
                                <div className="card-content">
                                    <h3>{analytics.cases_this_month}</h3>
                                    <p>Cases This Month</p>
                                </div>
                            </div>
                        </div>

                        <div className="analytics-grid">
                            <div className="analytics-section">
                                <h2>Case Status Distribution</h2>
                                <div className="status-chart">
                                    {Object.entries(statusStats).map(([status, count]) => (
                                        <div key={status} className="status-item">
                                            <div className="status-bar">
                                                <div 
                                                    className={`status-fill ${status}`}
                                                    style={{ width: `${analytics.total_cases > 0 ? (count / analytics.total_cases) * 100 : 0}%` }}
                                                ></div>
                                            </div>
                                            <div className="status-label">
                                                <span>{status.replace('_', ' ')}</span>
                                                <span>{count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="analytics-section">
                                <h2>Case Complexity Distribution</h2>
                                <div className="complexity-chart">
                                    {Object.entries(complexityStats).map(([complexity, count]) => (
                                        <div key={complexity} className="complexity-item">
                                            <div className="complexity-bar">
                                                <div 
                                                    className={`complexity-fill ${complexity.replace('_', '-')}`}
                                                    style={{ width: `${analytics.total_cases > 0 ? (count / analytics.total_cases) * 100 : 0}%` }}
                                                ></div>
                                            </div>
                                            <div className="complexity-label">
                                                <span>{complexity.replace('_', ' ')}</span>
                                                <span>{count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="analytics-section system-metrics">
                                <h2>System Performance</h2>
                                <div className="metrics-grid">
                                    <div className="metric-card">
                                        <h4>Completion Rate</h4>
                                        <div className="metric-value">
                                            {analytics.total_cases > 0 
                                                ? Math.round((analytics.completed_cases / analytics.total_cases) * 100)
                                                : 0
                                            }%
                                        </div>
                                    </div>
                                    
                                    <div className="metric-card">
                                        <h4>Average Processing Time</h4>
                                        <div className="metric-value">
                                            {cases.length > 0 
                                                ? Math.round(cases.reduce((sum, c) => sum + (c.estimated_duration || 0), 0) / cases.length)
                                                : 0
                                            } min
                                        </div>
                                    </div>
                                    
                                    <div className="metric-card">
                                        <h4>Active Workload</h4>
                                        <div className="metric-value">
                                            {analytics.pending_cases + analytics.scheduled_cases}
                                        </div>
                                    </div>
                                    
                                    <div className="metric-card">
                                        <h4>System Utilization</h4>
                                        <div className="metric-value">
                                            {analytics.total_judges > 0 
                                                ? Math.round(((analytics.pending_cases + analytics.scheduled_cases) / (analytics.total_judges * 10)) * 100)
                                                : 0
                                            }%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}