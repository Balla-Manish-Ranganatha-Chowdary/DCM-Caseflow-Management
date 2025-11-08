import { useState } from "react"
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
                    <button className="drop-down-btn">User</button>
                    <button className="drop-down-btn">Judge</button>
                    <button className="drop-down-btn">Admin</button>
                </div>
            )}
        </div>
    )
}