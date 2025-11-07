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
                <Link to="block" className='middle-link'>
                    <span className='link-element'> &#x2022; Blog</span>
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
        <div className='slogan-container'>
            <p className='slogan'>
                Data-Driven Justice, Seamless Case Flow
            </p>
            <p className='slogan'>
                @\\ 2025
            </p>
        </div>
        <div className='main'>
            <p className='into-statement'>
                “In a democracy where justice is the backbone of governance, 
                the Differential Case-Flow Management Application stands as a step toward a faster, 
                fairer, and more accountable judicial process.”
            </p>
        </div>
        <div className='conclusion'>
            <p className='conclusion-statement'>
                Creating a system where technology empowers fairness, 
                efficiency, and accountability in every case.
            </p>
            <button className='try-button'>
                Try for free
            </button>
            <button className='arrow-button'>
                &#8599;
            </button>
        </div>
        </>
    )
}