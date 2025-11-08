import { useState } from "react"
import { Link } from "react-router";
import './loginDropDown.css'
export function LoginDropDown(){
    const [showmenu, setshowmenu] = useState(false);
    return(
        <div
             className="login-container"
             onMouseEnter={()=>setshowmenu(true)}
             onMouseLeave={()=>setshowmenu(false)}
        >
            <div className="login-btn">
                login/sign-in
            </div>
            {showmenu && (
                <div className="drop-down">
                    <Link to="user-login-page">
                        <button className="drop-down-btn">User</button>
                    </Link>
                    <Link to="judge-login-page">
                        <button className="drop-down-btn">Judge</button>
                    </Link>
                    <Link to="admin-login-page">
                        <button className="drop-down-btn">Admin</button>
                    </Link>
                </div>
            )}
        </div>
    )
}