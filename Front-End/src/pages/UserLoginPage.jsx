import { Link } from "react-router"
import { LoginForm } from "../components/LoginForm"
import './UserLoginPage.css'

export function UserLoginPage() {
    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-form-section">
                    <div className="login-header">
                        <h1>User Login</h1>
                        <p>Welcome back! Please login to your account</p>
                    </div>
                    
                    <LoginForm 
                        loginEndpoint="/api/auth/login/user"
                        redirectPath="/user-dashboard"
                        isUser={true}
                        notjudge={true}
                        inputClass='login-input'
                        submitBtnName='Sign In'
                        submitClass='login-submit-btn'
                        registerLinkContainer='register-link-container'
                        registerLinkClass='register-link'
                    />
                </div>

                <div className="login-info-section">
                    <h2>New Here?</h2>
                    <p>Create an account to file cases, track status, and manage your legal matters efficiently.</p>
                    <Link to="/user-signup" className="signup-link-btn">
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    )
}
