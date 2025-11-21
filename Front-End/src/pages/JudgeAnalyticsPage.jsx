import { useState, useEffect } from 'react'
import { SharedNavbar } from '../components/SharedNavbar'
import './JudgeAnalyticsPage.css'

export function JudgeAnalyticsPage() {
    const [username, setUsername] = useState('')
    const [judgeId, setJudgeId] = useState(null)
    const [analytics, setAnalytics] = useState(null)
    const [cases, setCases] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedUsername = localStorage.getItem('username')
        const storedJudgeId = localStorage.getItem('userId')
        if (storedUsername) setUsername(storedUsername)
        if (storedJudgeId) {
            setJudgeId(parseInt(storedJudgeId))
            fetchAnalytics(parseInt(storedJudgeId))
            fetchCases(parseInt(storedJudgeId))
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

    const fetchCases = async (jid) => {
        try {
            const response = await fetch(`http://localhost:8000/api/cases/judge/${jid}`)
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

    const getMonthlyStats = () => {
        const monthlyData = {}
        cases.forEach(caseItem => {
            const month = new Date(caseItem.filed_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short' 
            })
            monthlyData[month] = (monthlyData[month] || 0) + 1
        })
        return monthlyData
    }

    if (loading) {
        return (
            <div className="judge-analytics-page">
                <SharedNavbar role="judge" username={username} />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading analytics...</p>
                </div>
            </div>
        )
    }

    const complexityStats = getComplexityStats()
    const monthlyStats = getMonthlyStats()

    return (
        <div className="judge-analytics-page">
            <SharedNavbar role="judge" username={username} />
            
            <div className="analytics-content">
                <div className="page-header">
                    <h1>Performance Analytics</h1>
                    <p>Detailed insights into your case management performance</p>
                </div>

                {analytics && (
                    <>
                        <div className="analytics-overview">
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

                        <div className="analytics-grid">
                            <div className="analytics-section">
                                <h2>Case Complexity Distribution</h2>
                                <div className="complexity-chart">
                                    <div className="complexity-item">
                                        <div className="complexity-bar">
                                            <div 
                                                className="complexity-fill simple"
                                                style={{ width: `${(complexityStats.simple / analytics.total_cases) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="complexity-label">
                                            <span>Simple</span>
                                            <span>{complexityStats.simple}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="complexity-item">
                                        <div className="complexity-bar">
                                            <div 
                                                className="complexity-fill moderate"
                                                style={{ width: `${(complexityStats.moderate / analytics.total_cases) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="complexity-label">
                                            <span>Moderate</span>
                                            <span>{complexityStats.moderate}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="complexity-item">
                                        <div className="complexity-bar">
                                            <div 
                                                className="complexity-fill complex"
                                                style={{ width: `${(complexityStats.complex / analytics.total_cases) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="complexity-label">
                                            <span>Complex</span>
                                            <span>{complexityStats.complex}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="complexity-item">
                                        <div className="complexity-bar">
                                            <div 
                                                className="complexity-fill highly-complex"
                                                style={{ width: `${(complexityStats.highly_complex / analytics.total_cases) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="complexity-label">
                                            <span>Highly Complex</span>
                                            <span>{complexityStats.highly_complex}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="analytics-section">
                                <h2>Performance Metrics</h2>
                                <div className="metrics-list">
                                    <div className="metric-item">
                                        <span className="metric-label">Completion Rate</span>
                                        <span className="metric-value">
                                            {analytics.total_cases > 0 
                                                ? Math.round((analytics.completed_cases / analytics.total_cases) * 100)
                                                : 0
                                            }%
                                        </span>
                                    </div>
                                    
                                    <div className="metric-item">
                                        <span className="metric-label">Cases This Month</span>
                                        <span className="metric-value">{analytics.cases_this_month}</span>
                                    </div>
                                    
                                    <div className="metric-item">
                                        <span className="metric-label">Average Case Duration</span>
                                        <span className="metric-value">
                                            {cases.length > 0 
                                                ? Math.round(cases.reduce((sum, c) => sum + (c.estimated_duration || 0), 0) / cases.length)
                                                : 0
                                            } min
                                        </span>
                                    </div>
                                    
                                    <div className="metric-item">
                                        <span className="metric-label">Active Workload</span>
                                        <span className="metric-value">
                                            {analytics.pending_cases + analytics.scheduled_cases} cases
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {Object.keys(monthlyStats).length > 0 && (
                            <div className="analytics-section monthly-section">
                                <h2>Monthly Case Distribution</h2>
                                <div className="monthly-chart">
                                    {Object.entries(monthlyStats).map(([month, count]) => (
                                        <div key={month} className="monthly-item">
                                            <div className="monthly-bar">
                                                <div 
                                                    className="monthly-fill"
                                                    style={{ 
                                                        height: `${(count / Math.max(...Object.values(monthlyStats))) * 100}%` 
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="monthly-label">
                                                <span>{month}</span>
                                                <span>{count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}