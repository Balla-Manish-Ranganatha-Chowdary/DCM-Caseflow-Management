import './HomePage.css'
export function HomePage (){
    return(
        <>
        <title>Diffrencial Case Managment</title>
        <div className="header">
            <div className="left-section">
                <div>
                    <a href="/" className='header-link'>
                        <img className="logo" src='../src/assets/logo.png' />
                    </a>
                </div>
                
            </div>
            <div className="middle-section">
                <a href="Policy" className='middle-link'>
                    <span className='link-element'> &#x2022; Policy</span>
                </a>
                <a href="terms-and-condition" className='middle-link'>
                    <span className='link-element'> &#x2022; Terms and Condition</span>
                </a>
                <a href="license" className='middle-link'>
                    <span className='link-element'> &#x2022; License</span>
                </a>
                <a href="contact" className='middle-link'>
                    <span className='link-element'> &#x2022; Contact us</span>
                </a>
            </div>
            <div className="right-section">
                <a href="login">
                    <button className="login-button">
                        Login/sign-in
                    </button>
                </a>
            </div>
        </div>
        </>
    )
}