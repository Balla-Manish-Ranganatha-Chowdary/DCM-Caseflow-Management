import { Link } from 'react-router'
import './HomePage.css'

export function HomePage (){
    return(
        <>
        <title>Diffrencial Case Managment</title>
        <div className="header">
            <div className="left-section">
                <div>
                    <Link to="/" className='header-link'>
                        <img className="logo" src='../src/assets/logo.png' />
                    </Link>
                </div>
                
            </div>
            <div className="middle-section">
                <Link to="policy" className='middle-link'>
                    <span className='link-element'> &#x2022; Policy</span>
                </Link>
                <Link to="terms-and-condition" className='middle-link'>
                    <span className='link-element'> &#x2022; Terms and Condition</span>
                </Link>
                <Link to="license" className='middle-link'>
                    <span className='link-element'> &#x2022; License</span>
                </Link>
                <Link to="contact" className='middle-link'>
                    <span className='link-element'> &#x2022; Contact us</span>
                </Link>
            </div>
            <div className="right-section">
                <Link to="login">
                    <button className="login-button">
                        Login/sign-in
                    </button>
                </Link>
            </div>
        </div>
        </>
    )
}