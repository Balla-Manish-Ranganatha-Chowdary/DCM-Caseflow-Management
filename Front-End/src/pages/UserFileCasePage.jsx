import { useState, useEffect } from 'react'
import { SharedNavbar } from '../components/SharedNavbar'
import { useNavigate } from 'react-router'
import './UserFileCasePage.css'

export function UserFileCasePage() {
    const [username, setUsername] = useState('')
    const [userId, setUserId] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        complexity: 'simple'
    })
    const [document, setDocument] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const storedUsername = localStorage.getItem('username')
        const storedUserId = localStorage.getItem('userId')
        if (storedUsername) setUsername(storedUsername)
        if (storedUserId) setUserId(parseInt(storedUserId))
    }, [])

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleFileChange = (e) => {
        setDocument(e.target.files[0])
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!userId) return

        setIsSubmitting(true)
        try {
            const formDataToSend = new FormData()
            formDataToSend.append('title', formData.title)
            formDataToSend.append('description', formData.description)
            formDataToSend.append('complexity', formData.complexity)
            formDataToSend.append('user_id', userId)
            if (document) {
                formDataToSend.append('document', document)
            }

            const response = await fetch('http://localhost:8000/api/cases/file', {
                method: 'POST',
                body: formDataToSend
            })

            if (response.ok) {
                const result = await response.json()
                alert(`Case filed successfully!\nCase Number: ${result.case_number}\nScheduled Date: ${result.scheduled_date}\nScheduled Time: ${result.scheduled_time}`)
                navigate('/user-check-status')
            } else {
                const error = await response.json()
                alert(`Error: ${error.detail}`)
            }
        } catch (error) {
            console.error('Error filing case:', error)
            alert('Failed to file case. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="file-case-page">
            <SharedNavbar role="user" username={username} />
            
            <div className="file-case-content">
                <div className="page-header">
                    <h1>File New Case</h1>
                    <p>Submit your legal case with our intelligent scheduling system</p>
                </div>

                <div className="form-container">
                    <form onSubmit={handleSubmit} className="case-form">
                        <div className="form-section">
                            <h3>Case Information</h3>
                            
                            <div className="form-group">
                                <label htmlFor="title">Case Title *</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter a descriptive title for your case"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Case Description *</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    rows="6"
                                    placeholder="Provide detailed information about your case..."
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="complexity">Case Complexity *</label>
                                <select
                                    id="complexity"
                                    name="complexity"
                                    value={formData.complexity}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="simple">Simple (30 minutes) - Minor disputes, documentation issues</option>
                                    <option value="moderate">Moderate (60 minutes) - Contract disputes, family matters</option>
                                    <option value="complex">Complex (120 minutes) - Property disputes, business litigation</option>
                                    <option value="highly_complex">Highly Complex (180 minutes) - Criminal cases, major civil suits</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="document">Supporting Documents (Optional)</label>
                                <input
                                    type="file"
                                    id="document"
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                />
                                <small className="file-help">
                                    Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                                </small>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button 
                                type="button" 
                                className="btn-secondary"
                                onClick={() => navigate('/user-dashboard')}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Filing Case...' : 'File Case'}
                            </button>
                        </div>
                    </form>

                    <div className="scheduling-info">
                        <h3>Scheduling Information</h3>
                        <div className="info-cards">
                            <div className="info-card">
                                <h4>Automatic Scheduling</h4>
                                <p>Your case will be automatically scheduled based on complexity and judge availability.</p>
                            </div>
                            <div className="info-card">
                                <h4>Priority System</h4>
                                <p>Complex cases receive earlier dates, while simple cases fill available time slots efficiently.</p>
                            </div>
                            <div className="info-card">
                                <h4>Notifications</h4>
                                <p>You'll receive immediate confirmation with your hearing date and time.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}