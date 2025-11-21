import { useState, useEffect } from "react"
import { Navbar } from "../components/NavBar"
import './JudgePage.css'

export function JudgePage() {
    const [cases, setCases] = useState([])
    const [username, setUsername] = useState('')
    const [judgeId, setJudgeId] = useState(null)
    const [selectedCase, setSelectedCase] = useState(null)

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

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Not scheduled'
        return new Date(dateStr).toLocaleDateString()
    }

    const formatTime = (timeStr) => {
        if (!timeStr) return ''
        return timeStr.substring(0, 5)
    }

    return (
        <>
            <title>Judge Page</title>
            <div className="judge-home-page">
                <Navbar />
                <h1 className="judge-welcome-message">
                    Welcome Judge {username}!
                </h1>
                <p className="judge-welcome-slogan">
                    "Focused Insights for Fair and Swift Justice."
                </p>

                <div className="cases-list">
                    <h2>Assigned Cases</h2>
                    {cases.length === 0 ? (
                        <p>No cases assigned yet.</p>
                    ) : (
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
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cases.map(caseItem => (
                                    <tr key={caseItem.id}>
                                        <td>{caseItem.case_number}</td>
                                        <td>{caseItem.title}</td>
                                        <td>{caseItem.complexity}</td>
                                        <td>{caseItem.status}</td>
                                        <td>{formatDate(caseItem.scheduled_date)}</td>
                                        <td>{formatTime(caseItem.scheduled_time)}</td>
                                        <td>{caseItem.estimated_duration}</td>
                                        <td>
                                            <button 
                                                className="schedule-hearing-btn"
                                                onClick={() => handleScheduleHearing(caseItem.id)}
                                            >
                                                Schedule Next Hearing
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    )
}
