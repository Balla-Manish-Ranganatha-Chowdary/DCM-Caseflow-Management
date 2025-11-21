import {LoginForm} from '../components/LoginForm'
import { admins } from '../data/admins';
import './AdminLoginPage.css';

export function AdminLoginPage(){
    return(
        <>
            <title>Admin login page</title>
            <div className='admin-log-in-page'>
                <div className='admin-log-in-container'>
                    <div className='admin-log-in-details'>
                        <div className='admin-log-in-header'>
                            <h1 className='admin-log-in-statment'>Log In</h1>
                            <p className='admin-log-in-request-access'>
                                Not admin yet?
                                <a href='request_access' className='request-access-link'>
                                    Request access
                                </a>
                            </p>
                        </div>
                        <LoginForm 
                            loginEndpoint="/api/auth/login/admin"
                            redirectPath="/admin-dashboard"
                            isJudge={true}
                            inputClass = 'admin-input'
                            submitBtnName = 'Log In'
                            submitClass = 'admin-signin-btn'
                        />
                        <div className='admin-log-in-footer'>
                            <p className='admin-log-in-request-access'>
                                Any query?
                                <a href='contact' className='request-access-link' >
                                    Call us now
                                </a>
                            </p>
                        </div>
                    </div>
                    <div className='admin-log-in-alternative-login'>
                        <p className='admin-log-in-alternative-statement'>
                            or continue with following options.
                        </p>
                        <a href='google.com'>
                            <img src='../src/assets/google.png' width='40px' className='admin-log-in-alternative-login-image' />
                        </a>
                        <a href='facebook.com'>
                            <img src='../src/assets/facebook.png' width='40px' className='admin-log-in-alternative-login-image' />
                        </a>
                        <a href='apple.com'>
                            <img src='../src/assets/apple.png' width='40px' className='admin-log-in-alternative-login-image'/>
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}