import { Navbar } from "../components/NavBar"
import './UserPage.css'
export function UserPage(){
    return(
        <>
            <title>User Page</title>
            <div className="user-home-page">
                <Navbar />
                <h1 className="user-welcome-message">
                Welcome [user] </h1>
                <p className="user-welcome-slogan">
                    "Your case management starts here — file new cases, 
                    check updates, and stay informed at every step."
                </p>
                <button className="file-btn">
                    File a case
                </button>
            </div>
            
        </>
    )
}