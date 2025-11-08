import { Link} from "react-router"
import './UserLoginPage.css';
export function UserLoginPage(){
    return(
        <>
            <title>User Login page</title>
            
            <div className="sign-in-format">
                <h1>Sign-in</h1>
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
                        Use your email password
                    </p>
                    <form action="/login">
                        <input type="email" className="email-form" placeholder="Email" />
                        <input type="password" className="password-form" placeholder="Password" />
                        <div className="forgot-container">
                            <Link to="forget-pass" className="forgot-link">
                                Forget your password?
                            </Link>
                        </div>
                        <button type="submit" className="sign-in-btn">
                            Sign In
                        </button>
                    </form>  
                </div>
            </div> 
            <div className="sign-up-format">
                <h1>DIV 2</h1>
            </div>
        </>
    )
}