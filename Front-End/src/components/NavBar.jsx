import "./Navbar.css";

export function Navbar() {
  return (
        <>
            <nav className="navbar">
                <div className="nav-logo">
                    <img src='/logo.png' alt="Logo" />
                </div>

                <ul className="nav-links">
                    <li><a href="/">Home</a></li>
                    <li><a href="/file-case">File a Case</a></li>
                    <li><a href="/check-status">Check Status</a></li>
                    <li><a href="/logout">Logout</a></li>
                </ul>
            </nav>
        </>
  )
}


