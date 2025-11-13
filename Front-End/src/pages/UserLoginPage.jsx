import { Link} from "react-router"
import { LoginForm } from "../components/LoginForm";
import './UserLoginPage.css';
export function UserLoginPage(){
    return(
        <>
            <title>User Login page</title>
            
            <div className="sign-in-format">
                <h1 className="user-log-in-h1">Sign-in</h1>
                <div className="alernative-login">
                    <a href="gmail.com" target="_blank" className="login-image">
                        <img src="../src/assets/mail.png" width="40px" className="logo" />
                    </a>
                    <a href="facebook.com" target="_blank" className="login-image">
                        <img src="../src/assets/facebook.png" width="40px" className="logo" />
                    </a>
                    <a href="github.com" target="_blank" className="login-image">
                        <img src="../src/assets/github.png" width="40px" className="logo" />
                    </a>
                    <a href="linkedin.com" target="_blank" className="login-image">
                        <img src="../src/assets/linkedin.png" width="40px" className="logo" />
                    </a>
                </div>
                <div className="login-form">
                    <p className="p-sentence">
                        Use your email & password
                    </p>
                    <LoginForm 
                        isUser={true}
                        inputClass = 'user-input'
                        submitBtnName = 'Sign-in'
                        submitClass = 'user-signin-btn'
                        registerLinkContainer = 'user-register-link-contain'
                        registerLinkClass = 'user-register-link'
                    />  
                </div>
            </div> 
            <div className="sign-up-format">
                <div className="greeting-container">
                    <h1 className="greeting-sentence">Hello, User!</h1>
                    <p className="greeting-description">Register with your personal details to use all of site features</p>
                    <Link >
                    <button className="sign-up-btn">
                        Sign Up
                    </button>
                    </Link>
                </div>
            </div>
        </>
    )
}