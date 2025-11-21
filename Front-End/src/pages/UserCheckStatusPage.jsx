import { useState, useEffect } from 'react'
import { SharedNavbar } from '../components/SharedNavbar'
import './UserCheckStatusPage.css'

export function UserCheckStatusPage() {
    const [username, setUsername] = useState('')
    const [userId, setUserId] = useState(null)
    const [cases, setCases] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedCase, setSelectedCase] = useState(null)

    useEffect(() => {
        const storedUsername = localStorage.getItem('username')
        const storedUserId = localStorage.getItem('userId')
        if (storedUsername) setUsername(storedUsername)
        if (storedUserId) {
            setUserId(parseInt(storedUserId))
            fetchUserCases(parseInt(storedUserId))
        }
    }, [])

    const fetchUserCases = async (uid) => {
        try {
            const response = await fetch(`http://localhost:8000/api/cases/user/${uid}`)
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

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Not scheduled'
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const formatTime = (timeStr) => {
        if (!timeStr) return ''
        return timeStr.substring(0, 5)
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#f39c12'
            case 'scheduled': return '#3498db'
            case 'in_progress': return '#9b59b6'
            case 'completed': return '#27ae60'
            case 'adjourned': return '#e74c3c'
            default: return '#95a5a6'
        }
    }

    const getComplexityColor = (complexity) => {
        switch (complexity) {
            case 'simple': return '#2ecc71'
            case 'moderate': return '#f39c12'
            case 'complex': return '#e67e22'
            case 'highly_complex': return '#e74c3c'
            default: return '#95a5a6'
        }
    }

    if (loading) {
        return (
            <div className="check-status-page">
                <SharedNavbar role="user" username={username} />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your cases...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="check-status-page">
            <SharedNavbar role="user" username={username} />
            
            <div className="status-content">
                <div className="page-header">
                    <h1>Case Status</h1>
                    <p>Track all your filed cases and their current status</p>
                </div>

                {cases.length === 0 ? (
                    <div className="no-cases-container">
                        <div className="no-cases-icon">📋</div>
                        <h2>No Cases Filed Yet</h2>
                        <p>You haven't filed any cases yet. Start by filing your first case.</p>
                        <a href="/user-file-case" className="file-case-btn">File Your First Case</a>
                    </div>
                ) : (
                    <div className="cases-container">
                        <div className="cases-grid">
                            {cases.map(caseItem => (
                                <div 
                                    key={caseItem.id} 
                                    className="case-card"
                                    onClick={() => setSelectedCase(caseItem)}
                                >
                                    <div className="case-header">
                                        <h3>{caseItem.title}</h3>
                                        <span 
                                            className="status-badge"
                                            style={{ backgroundColor: getStatusColor(caseItem.status) }}
                                        >
                                            {caseItem.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    
                                    <div className="case-info">
                                        <p className="case-number">Case #{caseItem.case_number}</p>
                                        <p className="filed-date">Filed: {formatDate(caseItem.filed_at)}</p>
                                    </div>

                                    <div className="case-details">
                                        <div className="detail-item">
                                            <span className="label">Complexity:</span>
                                            <span 
                                                className="complexity-badge"
                                                style={{ backgroundColor: getComplexityColor(caseItem.complexity) }}
                                            >
                                                {caseItem.complexity.replace('_', ' ')}
                                            </span>
                                        </div>
                                        
                                        {caseItem.scheduled_date && (
                                            <div className="detail-item">
                                                <span className="label">Next Hearing:</span>
                                                <span className="hearing-info">
                                                    {formatDate(caseItem.scheduled_date)}
                                                    {caseItem.scheduled_time && ` at ${formatTime(caseItem.scheduled_time)}`}
                                                </span>
                                            </div>
                                        )}

                                        {caseItem.status === 'completed' && caseItem.judgment && (
                                            <div className="detail-item">
                                                <span className="label">Status:</span>
                                                <span className="judgment-indicator">Judgment Available</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Case Detail Modal */}
                {selectedCase && (
                    <div className="case-modal-overlay" onClick={() => setSelectedCase(null)}>
                        <div className="case-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>{selectedCase.title}</h2>
                                <button 
                                    className="close-modal"
                                    onClick={() => setSelectedCase(null)}
                                >
                                    ×
                                </button>
                            </div>
                            
                            <div className="modal-content">
                                <div className="case-detail-section">
                                    <h4>Case Information</h4>
                                    <p><strong>Case Number:</strong> {selectedCase.case_number}</p>
                                    <p><strong>Status:</strong> 
                                        <span 
                                            className="status-badge"
                                            style={{ backgroundColor: getStatusColor(selectedCase.status) }}
                                        >
                                            {selectedCase.status.replace('_', ' ')}
                                        </span>
                                    </p>
                                    <p><strong>Complexity:</strong> {selectedCase.complexity.replace('_', ' ')}</p>
                                    <p><strong>Filed Date:</strong> {formatDate(selectedCase.filed_at)}</p>
                                </div>

                                <div className="case-detail-section">
                                    <h4>Description</h4>
                                    <p>{selectedCase.description}</p>
                                </div>

                                {selectedCase.scheduled_date && (
                                    <div className="case-detail-section">
                                        <h4>Hearing Schedule</h4>
                                        <p><strong>Date:</strong> {formatDate(selectedCase.scheduled_date)}</p>
                                        <p><strong>Time:</strong> {formatTime(selectedCase.scheduled_time)}</p>
                                        <p><strong>Duration:</strong> {selectedCase.estimated_duration} minutes</p>
                                    </div>
                                )}

                                {selectedCase.judgment && (
                                    <div className="case-detail-section judgment-section">
                                        <h4>Judgment</h4>
                                        <p><strong>Date:</strong> {formatDate(selectedCase.judgment_date)}</p>
                                        <div className="judgment-text">
                                            {selectedCase.judgment}
                                        </div>
                                    </div>
                                )}

                                {selectedCase.document_filename && (
                                    <div className="case-detail-section">
                                        <h4>Attached Documents</h4>
                                        <p>📎 {selectedCase.document_filename}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}