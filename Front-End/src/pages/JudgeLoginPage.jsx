import { LoginForm } from '../components/LoginForm'
import './JudgeLoginPage.css'

export function JudgeLoginPage() {
    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-form-section">
                    <div className="login-header">
                        <h1>Judge Login</h1>
                        <p>"Focused Insights for Fair and Swift Justice"</p>
                    </div>
                    
                    <LoginForm 
                        loginEndpoint="/api/auth/login/judge"
                        redirectPath="/judge-dashboard"
                        isUser={false}
                        notjudge={false}
                        inputClass='login-input'
                        submitBtnName='Sign In'
                        submitClass='login-submit-btn'
                        registerLinkContainer='register-link-container'
                        registerLinkClass='register-link'
                    />
                </div>

                <div className="login-info-section judge-info">
                    <div className="info-icon">⚖️</div>
                    <h2>Judicial Portal</h2>
                    <p>Access your case dashboard, manage hearings, and deliver justice efficiently.</p>
                    <div className="info-features">
                        <div className="feature-item">✓ Case Management</div>
                        <div className="feature-item">✓ Schedule Hearings</div>
                        <div className="feature-item">✓ Performance Analytics</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
