import { useState, useEffect } from 'react'
import { SharedNavbar } from '../components/SharedNavbar'
import './JudgeCasesPage.css'

export function JudgeCasesPage() {
    const [username, setUsername] = useState('')
    const [judgeId, setJudgeId] = useState(null)
    const [cases, setCases] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedUsername = localStorage.getItem('username')
        const storedJudgeId = localStorage.getItem('userId')
        if (storedUsername) setUsername(storedUsername)
        if (storedJudgeId) {
            setJudgeId(parseInt(storedJudgeId))
            fetchJudgeCases(parseInt(storedJudgeId))
        }
    }, [])

    const fetchJudgeCases = async (jid) => {
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

    const handleScheduleHearing = async (caseId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/judges/schedule-hearing?judge_id=${judgeId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ case_id: caseId })
            })
            
            if (response.ok) {
                const data = await response.json()
                alert(`Hearing scheduled successfully!\nDate: ${data.hearing.scheduled_date}\nTime: ${data.hearing.scheduled_time}`)
                fetchJudgeCases(judgeId)
            } else {
                const error = await response.json()
                alert(`Error: ${error.detail}`)
            }
        } catch (error) {
            console.error('Error scheduling hearing:', error)
            alert('Failed to schedule hearing')
        }
    }

    const handleCloseCase = async (caseId) => {
        const judgment = prompt('Enter your judgment for this case:')
        if (!judgment) return

        try {
            const response = await fetch(`http://localhost:8000/api/judges/close-case?judge_id=${judgeId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    case_id: caseId,
                    judgment: judgment
                })
            })
            
            if (response.ok) {
                alert('Case closed successfully!')
                fetchJudgeCases(judgeId)
            } else {
                const error = await response.json()
                alert(`Error: ${error.detail}`)
            }
        } catch (error) {
            console.error('Error closing case:', error)
            alert('Failed to close case')
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

    if (loading) {
        return (
            <div className="judge-cases-page">
                <SharedNavbar role="judge" username={username} />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading cases...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="judge-cases-page">
            <SharedNavbar role="judge" username={username} />
            
            <div className="cases-content">
                <div className="page-header">
                    <h1>My Cases</h1>
                    <p>Manage all your assigned cases and schedule hearings</p>
                </div>

                {cases.length === 0 ? (
                    <div className="no-cases-container">
                        <div className="no-cases-icon">⚖️</div>
                        <h2>No Cases Assigned</h2>
                        <p>You don't have any cases assigned yet.</p>
                    </div>
                ) : (
                    <div className="cases-table-container">
                        <table className="cases-table">
                            <thead>
                                <tr>
                                    <th>Case Number</th>
                                    <th>Title</th>
                                    <th>Complexity</th>
                                    <th>Status</th>
                                    <th>Scheduled Date</th>
                                    <th>Scheduled Time</th>
                                    <th>Duration (min)</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cases.map(caseItem => (
                                    <tr key={caseItem.id}>
                                        <td>{caseItem.case_number}</td>
                                        <td>{caseItem.title}</td>
                                        <td>
                                            <span className={`complexity-badge ${caseItem.complexity}`}>
                                                {caseItem.complexity.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${caseItem.status}`}>
                                                {caseItem.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td>{formatDate(caseItem.scheduled_date)}</td>
                                        <td>{formatTime(caseItem.scheduled_time)}</td>
                                        <td>{caseItem.estimated_duration}</td>
                                        <td>
                                            <div className="action-buttons">
                                                {caseItem.status !== 'completed' && (
                                                    <>
                                                        <button 
                                                            className="schedule-hearing-btn"
                                                            onClick={() => handleScheduleHearing(caseItem.id)}
                                                        >
                                                            Schedule Hearing
                                                        </button>
                                                        <button 
                                                            className="close-case-btn"
                                                            onClick={() => handleCloseCase(caseItem.id)}
                                                        >
                                                            Close Case
                                                        </button>
                                                    </>
                                                )}
                                                {caseItem.status === 'completed' && (
                                                    <span className="completed-text">Case Closed</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}