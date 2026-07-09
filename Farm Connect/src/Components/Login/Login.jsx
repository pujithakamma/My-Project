import { useState } from "react";
import "./Login.css";

function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("info");
    const [isLoading, setIsLoading] = useState(false);

    function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        setMessage("");

        if (!email.trim() || !password.trim()) {
            setMessage("Please enter both email and password.");
            setMessageType("error");
            setTimeout(() => {
                setMessage("");
                setIsLoading(false);
            }, 2000);
            return;
        }

        setTimeout(() => {
            const isValidLogin =
                (email === "admin@gamil.com" || email === "admin@gmail.com") &&
                password === "admin123";

            if (isValidLogin) {
                setMessage("Login successful!");
                setMessageType("success");
                setTimeout(() => {
                    onLoginSuccess();
                    setIsLoading(false);
                }, 500);
            } else {
                setMessage("Invalid credentials. Please check your email and password.");
                setMessageType("error");
                setIsLoading(false);
            }
            setTimeout(() => setMessage(""), 2000);
        }, 2000);
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <h2>Farm Connect</h2>
                <h1>Login Page</h1>
                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        disabled={isLoading}
                    />
                    <div className="password-field">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <button type="submit" className="login-btn" disabled={isLoading}>
                        {isLoading ? "Loading..." : "Login"}
                    </button>
                    <button
                        type="button"
                        className="toggle-password-btn"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? "Hide Password" : "Show Password"}
                    </button>
                </form>
                {message && <p className={`login-message ${messageType}`}>{message}</p>}
            </div>
        </div>
    );
}

export default Login;
