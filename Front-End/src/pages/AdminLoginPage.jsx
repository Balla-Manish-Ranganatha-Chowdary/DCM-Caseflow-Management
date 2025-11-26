import { LoginForm } from '../components/LoginForm'
import './AdminLoginPage.css'

export function AdminLoginPage() {
    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-form-section">
                    <div className="login-header">
                        <h1>Admin Login</h1>
                        <p>System Administration Portal</p>
                    </div>
                    
                    <LoginForm 
                        loginEndpoint="/api/auth/login/admin"
                        redirectPath="/admin-dashboard"
                        isUser={false}
                        notjudge={false}
                        inputClass='login-input'
                        submitBtnName='Sign In'
                        submitClass='login-submit-btn'
                        registerLinkContainer='register-link-container'
                        registerLinkClass='register-link'
                    />
                    
                    <div className="admin-note">
                        <p>Need access? Contact system administrator</p>
                    </div>
                </div>

                <div className="login-info-section admin-info">
                    <div className="info-icon">🔐</div>
                    <h2>Admin Portal</h2>
                    <p>Manage the entire case management system with comprehensive administrative controls.</p>
                    <div className="info-features">
                        <div className="feature-item">✓ System Analytics</div>
                        <div className="feature-item">✓ User Management</div>
                        <div className="feature-item">✓ Database Control</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
