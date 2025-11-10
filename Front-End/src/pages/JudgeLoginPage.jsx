import './JudgeLoginPage.css'

export function JudgeLoginPage(){
    return(
        <>
            <title>Judge Login Page</title>
            <div className="judge-login-page-container">
                <div className='sign-in-container'>
                    <div className='sign-in-into'>
                        <img src='../src/assets/sign_in.png' width="50px" className='sign-in-img' />
                        <h3>Sign in with email</h3>
                        <p>
                            “Focused Insights for Fair and Swift Justice.”
                        </p>
                    </div>
                    <div className='login-form'>
                        <form action='login'>
                            <input type='email' placeholder='Email' className='email-input' />
                            <input type='password' placeholder='Password' className='password-input' />
                            <a href="forgot password" className='forgot-password-link'>
                                Forgot password?
                            </a>
                            <button type='submit' className='submit-btn'>
                                Get Started
                            </button>
                        </form>
                    </div>
                    <div className='alternative-sign-in-option'>
                        <p className='alternative-sign-in-statement'>or sign in with</p>
                        <a href='google.com' target='_blank' className='alternative-link' >
                            <img src="../src/assets/google.png" width="40px" className='alternative-sign-in-application' />
                        </a>
                        <a href='facebook.com' target='_blank' className='alternative-link'>
                            <img src='../src/assets/facebook.png' width="40px" className='alternative-sign-in-application' />
                        </a>
                        <a href='apple.com' target='_blank' className='alternative-link'>
                            <img src='../src/assets/apple.png' width="40px" className='alternative-sign-in-application' />
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}