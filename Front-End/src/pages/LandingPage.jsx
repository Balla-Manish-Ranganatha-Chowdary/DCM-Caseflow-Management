import { useState } from 'react'
import { Link } from 'react-router'
import './LandingPage.css'

export function LandingPage() {
    const [showLoginOptions, setShowLoginOptions] = useState(false)

    return (
        <div className="landing-page">
            <div className="landing-header">
                <div className="logo-section">
                    <img src="/logo.png" alt="DCM Logo" className="landing-logo" />
                    <h1>Differential Case Management System</h1>
                </div>
                <nav className="landing-nav">
                    <button 
                        className="login-signup-btn"
                        onClick={() => setShowLoginOptions(!showLoginOptions)}
                    >
                        Login / Sign Up
                    </button>
                </nav>
            </div>

            <div className="landing-content">
                <div className="hero-section">
                    <h2>Intelligent Case Scheduling & Management</h2>
                    <p>
                        Advanced multi-level queue scheduling system that prioritizes cases 
                        based on complexity for efficient judicial workflow management.
                    </p>
                </div>

                {showLoginOptions && (
                    <div className="login-options-modal">
                        <div className="modal-content">
                            <h3>Choose Your Role</h3>
                            <div className="role-options">
                                <div className="role-card">
                                    <h4>User</h4>
                                    <p>File cases, track status, and manage your legal matters</p>
                                    <div className="role-buttons">
                                        <Link to="/user-login" className="btn-primary">Login</Link>
                                        <Link to="/user-signup" className="btn-secondary">Sign Up</Link>
                                    </div>
                                </div>
                                
                                <div className="role-card">
                                    <h4>Judge</h4>
                                    <p>Manage assigned cases, schedule hearings, and deliver judgments</p>
                                    <div className="role-buttons">
                                        <Link to="/judge-login-page" className="btn-primary">Login</Link>
                                    </div>
                                </div>
                                
                                <div className="role-card">
                                    <h4>Admin</h4>
                                    <p>System administration, analytics, and database management</p>
                                    <div className="role-buttons">
                                        <Link to="/admin-login-page" className="btn-primary">Login</Link>
                                    </div>
                                </div>
                            </div>
                            <button 
                                className="close-modal"
                                onClick={() => setShowLoginOptions(false)}
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}

                <div className="features-section">
                    <h3>Key Features</h3>
                    <div className="features-grid">
                        <div className="feature-card">
                            <h4>Smart Scheduling</h4>
                            <p>Multi-level queue algorithm prioritizes complex cases for earlier dates</p>
                        </div>
                        <div className="feature-card">
                            <h4>Real-time Updates</h4>
                            <p>Live case status tracking and hearing notifications</p>
                        </div>
                        <div className="feature-card">
                            <h4>Document Management</h4>
                            <p>Secure file upload and storage for case documents</p>
                        </div>
                        <div className="feature-card">
                            <h4>Analytics Dashboard</h4>
                            <p>Comprehensive insights for judges and administrators</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}