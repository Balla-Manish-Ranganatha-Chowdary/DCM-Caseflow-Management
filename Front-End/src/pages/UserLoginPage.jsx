import { Link} from "react-router"
import './UserLoginPage.css';
export function UserLoginPage(){
    return(
        <>
            <title>User Login page</title>
            
            <div className="sign-in-format">
                <h1>Sign-in</h1>
                <div className="alernative-login">
                    <a href="gmail.com" target="_blank">
                        <img src="../src/assets/mail.png" width="50px" />
                    </a>
                    <a href="facebook.com" target="_blank">
                        <img src="../src/assets/facebook.png" width="50px"/>
                    </a>
                    <a href="github.com" target="_blank">
                        <img src="../src/assets/github.png" width="50px" />
                    </a>
                    <a href="linkedin.com" target="_blank">
                        <img src="../src/assets/linked.png" width="50px" />
                    </a>
                </div>
                <div className="login-form">
                    <h2>Use your email password</h2>
                    <form action="/login">
                        <input type="email" className="email-form" placeholder="Email" />
                        <input type="password" className="password-form" placeholder="password" />
                        <div>
                            <Link to="forget-pass">Forget your password</Link>
                        </div>
                        <button type="submit">Sign In</button>
                    </form>  
                </div>
            </div> 
            <div className="sign-up-format">
                <h1>DIV 2</h1>
            </div>
        </>
    )
}