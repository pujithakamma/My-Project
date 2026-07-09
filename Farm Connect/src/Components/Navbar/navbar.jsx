import "./Navbar.css";

function Navbar({ onNavigateToRegistration, onNavigateToHome, onNavigateToLogin }) {
    return (
        <nav className="navbar">
            <h2 
                onClick={onNavigateToHome} 
                style={{ cursor: onNavigateToHome ? "pointer" : "default" }}
            > 
                Farm Connect
            </h2>

            <ul>
                <li onClick={onNavigateToHome} style={{ cursor: onNavigateToHome ? "pointer" : "default" }}>
                    Home
                </li>
                <li>Products</li>
                <li>Farmers</li>
                <li>Contact</li>
                {onNavigateToLogin && (
                    <li onClick={onNavigateToLogin}>
                        Login
                    </li>
                )}
                {onNavigateToRegistration && (
                    <li 
                        onClick={onNavigateToRegistration}
                        className="nav-register-btn"
                    >
                        Register
                    </li>
                )}
            </ul>
        </nav>
    );
}
export default Navbar;