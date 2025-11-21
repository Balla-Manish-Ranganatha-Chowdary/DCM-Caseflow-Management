import { Navbar } from "../components/NavBar"
import { useState, useEffect } from "react"
import './UserPage.css'

export function UserPage(){
    const [showFileForm, setShowFileForm] = useState(false)
    const [cases, setCases] = useState([])
    const [username, setUsername] = useState('')
    const [userId, setUserId] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        complexity: 'simple'
    })

    useEffect(() => {
        // Get user info from localStorage
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
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`http://localhost:8000/api/cases/file?user_id=${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            
            if (response.ok) {
                alert('Case filed and scheduled successfully!')
                setShowFileForm(false)
                setFormData({ title: '', description: '', complexity: 'simple' })
                fetchUserCases(userId)
            } else {
                const error = await response.json()
                alert(`Error: ${error.detail}`)
            }
        } catch (error) {
            console.error('Error filing case:', error)
            alert('Failed to file case')
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

    return(
        <>
            <title>User Page</title>
            <div className="user-home-page">
                <Navbar />
                <h1 className="user-welcome-message">
                    Welcome {username || 'User'}!
                </h1>
                <p className="user-welcome-slogan">
                    "Your case management starts here — file new cases, 
                    check updates, and stay informed at every step."
                </p>
                
                <button className="file-btn" onClick={() => setShowFileForm(!showFileForm)}>
                    {showFileForm ? 'Cancel' : 'File a case'}
                </button>

                {showFileForm && (
                    <div className="file-case-form">
                        <h2>File New Case</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Case Title"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                required
                                className="case-input"
                            />
                            <textarea
                                placeholder="Case Description"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                required
                                className="case-textarea"
                                rows="5"
                            />
                            <select
                                value={formData.complexity}
                                onChange={(e) => setFormData({...formData, complexity: e.target.value})}
                                className="case-select"
                            >
                                <option value="simple">Simple (30 min)</option>
                                <option value="moderate">Moderate (60 min)</option>
                                <option value="complex">Complex (120 min)</option>
                                <option value="highly_complex">Highly Complex (180 min)</option>
                            </select>
                            <button type="submit" className="submit-case-btn">Submit Case</button>
                        </form>
                    </div>
                )}

                <div className="cases-list">
                    <h2>My Cases</h2>
                    {cases.length === 0 ? (
                        <p>No cases filed yet.</p>
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