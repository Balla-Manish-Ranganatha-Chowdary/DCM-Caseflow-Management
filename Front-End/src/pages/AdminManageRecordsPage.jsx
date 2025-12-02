import { useState, useEffect } from 'react'
import { SharedNavbar } from '../components/SharedNavbar'
import './AdminManageRecordsPage.css'

export function AdminManageRecordsPage() {
    const [username, setUsername] = useState('')
    const [activeTab, setActiveTab] = useState('cases')
    const [cases, setCases] = useState([])
    const [users, setUsers] = useState([])
    const [judges, setJudges] = useState([])
    const [loading, setLoading] = useState(true)
    
    // Edit modal states
    const [showEditModal, setShowEditModal] = useState(false)
    const [editType, setEditType] = useState('') // 'case', 'user', or 'judge'
    const [editData, setEditData] = useState(null)
    const [editFormData, setEditFormData] = useState({})

    useEffect(() => {
        const storedUsername = localStorage.getItem('username')
        if (storedUsername) setUsername(storedUsername)
        fetchAllData()
    }, [])

    const fetchAllData = async () => {
        setLoading(true)
        try {
            await Promise.all([
                fetchCases(),
                fetchUsers(),
                fetchJudges()
            ])
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchCases = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/admins/cases')
            if (response.ok) {
                const data = await response.json()
                setCases(data)
            }
        } catch (error) {
            console.error('Error fetching cases:', error)
        }
    }

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/admins/users')
            if (response.ok) {
                const data = await response.json()
                setUsers(data)
            }
        } catch (error) {
            console.error('Error fetching users:', error)
        }
    }

    const fetchJudges = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/admins/judges')
            if (response.ok) {
                const data = await response.json()
                setJudges(data)
            }
        } catch (error) {
            console.error('Error fetching judges:', error)
        }
    }

    // EDIT HANDLERS
    const handleEditCase = (caseItem) => {
        setEditType('case')
        setEditData(caseItem)
        setEditFormData({
            title: caseItem.title,
            description: caseItem.description,
            complexity: caseItem.complexity,
            status: caseItem.status,
            judgment: caseItem.judgment || ''
        })
        setShowEditModal(true)
    }

    const handleEditUser = (user) => {
        setEditType('user')
        setEditData(user)
        setEditFormData({
            username: user.username,
            email: user.email
        })
        setShowEditModal(true)
    }

    const handleEditJudge = (judge) => {
        setEditType('judge')
        setEditData(judge)
        setEditFormData({
            username: judge.username,
            email: judge.email
        })
        setShowEditModal(true)
    }

    const handleSaveEdit = async () => {
        try {
            let response
            
            if (editType === 'case') {
                response = await fetch(`http://localhost:8000/api/admins/cases/${editData.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(editFormData)
                })
                if (response.ok) {
                    alert('Case updated successfully')
                    fetchCases()
                }
            } else if (editType === 'user') {
                response = await fetch(
                    `http://localhost:8000/api/admins/users/${editData.id}?username=${editFormData.username}&email=${editFormData.email}`,
                    { method: 'PUT' }
                )
                if (response.ok) {
                    alert('User updated successfully')
                    fetchUsers()
                }
            } else if (editType === 'judge') {
                response = await fetch(
                    `http://localhost:8000/api/admins/judges/${editData.id}?username=${editFormData.username}&email=${editFormData.email}`,
                    { method: 'PUT' }
                )
                if (response.ok) {
                    alert('Judge updated successfully')
                    fetchJudges()
                }
            }

            if (!response.ok) {
                const error = await response.json()
                alert(`Error: ${error.detail}`)
            } else {
                setShowEditModal(false)
            }
        } catch (error) {
            console.error('Error updating record:', error)
            alert('Failed to update record')
        }
    }

    // DELETE HANDLERS
    const handleDeleteCase = async (caseId) => {
        if (!window.confirm('Are you sure you want to delete this case? This action cannot be undone.')) return

        try {
            const response = await fetch(`http://localhost:8000/api/admins/cases/${caseId}`, {
                method: 'DELETE'
            })
            if (response.ok) {
                alert('Case deleted successfully')
                fetchCases()
            } else {
                alert('Failed to delete case')
            }
        } catch (error) {
            console.error('Error deleting case:', error)
            alert('Failed to delete case')
        }
    }

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? All their cases will also be deleted.')) return

        try {
            const response = await fetch(`http://localhost:8000/api/admins/users/${userId}`, {
                method: 'DELETE'
            })
            if (response.ok) {
                alert('User deleted successfully')
                fetchUsers()
            } else {
                alert('Failed to delete user')
            }
        } catch (error) {
            console.error('Error deleting user:', error)
            alert('Failed to delete user')
        }
    }

    const handleDeleteJudge = async (judgeId) => {
        if (!window.confirm('Are you sure you want to delete this judge? Their assigned cases will be unassigned.')) return

        try {
            const response = await fetch(`http://localhost:8000/api/admins/judges/${judgeId}`, {
                method: 'DELETE'
            })
            if (response.ok) {
                alert('Judge deleted successfully')
                fetchJudges()
            } else {
                alert('Failed to delete judge')
            }
        } catch (error) {
            console.error('Error deleting judge:', error)
            alert('Failed to delete judge')
        }
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A'
        return new Date(dateStr).toLocaleDateString()
    }

    if (loading) {
        return (
            <div className="manage-records-page">
                <SharedNavbar role="admin" username={username} />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading records...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="manage-records-page">
            <SharedNavbar role="admin" username={username} />
            
            <div className="records-content">
                <div className="page-header">
                    <h1>Manage Database Records</h1>
                    <p>View, modify, and delete system records</p>
                </div>

                <div className="tabs">
                    <button 
                        className={`tab ${activeTab === 'cases' ? 'active' : ''}`}
                        onClick={() => setActiveTab('cases')}
                    >
                        Cases ({cases.length})
                    </button>
                    <button 
                        className={`tab ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Users ({users.length})
                    </button>
                    <button 
                        className={`tab ${activeTab === 'judges' ? 'active' : ''}`}
                        onClick={() => setActiveTab('judges')}
                    >
                        Judges ({judges.length})
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'cases' && (
                        <div className="table-container">
                            <h2>Cases Management</h2>
                            <table className="records-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Case Number</th>
                                        <th>Title</th>
                                        <th>Status</th>
                                        <th>Complexity</th>
                                        <th>Filed Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cases.map(caseItem => (
                                        <tr key={caseItem.id}>
                                            <td>{caseItem.id}</td>
                                            <td>{caseItem.case_number}</td>
                                            <td>{caseItem.title}</td>
                                            <td>
                                                <span className={`status-badge ${caseItem.status}`}>
                                                    {caseItem.status}
                                                </span>
                                            </td>
                                            <td>{caseItem.complexity}</td>
                                            <td>{formatDate(caseItem.filed_at)}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button 
                                                        className="edit-btn"
                                                        onClick={() => handleEditCase(caseItem)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className="delete-btn"
                                                        onClick={() => handleDeleteCase(caseItem.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="table-container">
                            <h2>Users Management</h2>
                            <table className="records-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Created At</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>{formatDate(user.created_at)}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button 
                                                        className="edit-btn"
                                                        onClick={() => handleEditUser(user)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className="delete-btn"
                                                        onClick={() => handleDeleteUser(user.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'judges' && (
                        <div className="table-container">
                            <h2>Judges Management</h2>
                            <table className="records-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Created At</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {judges.map(judge => (
                                        <tr key={judge.id}>
                                            <td>{judge.id}</td>
                                            <td>{judge.username}</td>
                                            <td>{judge.email}</td>
                                            <td>{formatDate(judge.created_at)}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button 
                                                        className="edit-btn"
                                                        onClick={() => handleEditJudge(judge)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className="delete-btn"
                                                        onClick={() => handleDeleteJudge(judge.id)}
                                                    >
                                                        Delete
                                                    </button>
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

            {/* EDIT MODAL */}
            {showEditModal && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Edit {editType === 'case' ? 'Case' : editType === 'user' ? 'User' : 'Judge'}</h2>
                            <button className="close-modal" onClick={() => setShowEditModal(false)}>×</button>
                        </div>
                        
                        <div className="modal-body">
                            {editType === 'case' && (
                                <>
                                    <div className="form-group">
                                        <label>Title</label>
                                        <input
                                            type="text"
                                            value={editFormData.title}
                                            onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea
                                            value={editFormData.description}
                                            onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                                            rows="4"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Complexity</label>
                                        <select
                                            value={editFormData.complexity}
                                            onChange={(e) => setEditFormData({...editFormData, complexity: e.target.value})}
                                        >
                                            <option value="simple">Simple</option>
                                            <option value="moderate">Moderate</option>
                                            <option value="complex">Complex</option>
                                            <option value="highly_complex">Highly Complex</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Status</label>
                                        <select
                                            value={editFormData.status}
                                            onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="scheduled">Scheduled</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                            <option value="adjourned">Adjourned</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Judgment (Optional)</label>
                                        <textarea
                                            value={editFormData.judgment}
                                            onChange={(e) => setEditFormData({...editFormData, judgment: e.target.value})}
                                            rows="3"
                                            placeholder="Enter judgment if case is completed"
                                        />
                                    </div>
                                </>
                            )}

                            {editType === 'user' && (
                                <>
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input
                                            type="text"
                                            value={editFormData.username}
                                            onChange={(e) => setEditFormData({...editFormData, username: e.target.value})}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            value={editFormData.email}
                                            onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                                        />
                                    </div>
                                </>
                            )}

                            {editType === 'judge' && (
                                <>
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input
                                            type="text"
                                            value={editFormData.username}
                                            onChange={(e) => setEditFormData({...editFormData, username: e.target.value})}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            value={editFormData.email}
                                            onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button className="cancel-btn" onClick={() => setShowEditModal(false)}>
                                Cancel
                            </button>
                            <button className="save-btn" onClick={handleSaveEdit}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
