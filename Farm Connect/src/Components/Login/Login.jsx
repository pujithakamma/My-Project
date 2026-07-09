import { useState } from "react";
import "./Login.css";

function Login({ onLoginSuccess, onNavigateToRegistration, registeredUsers = [] }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("info");
    const [isLoading, setIsLoading] = useState(false);

    function handleClear() {
        setEmail("");
        setPassword("");
        setMessage("");
        setMessageType("info");
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (!email.trim() || !password.trim()) {
            setMessage("Please enter both email and password.");
            setMessageType("error");
            return;
        }

        setIsLoading(true);
        setMessage("Checking your credentials...");
        setMessageType("info");

        window.setTimeout(() => {
            const normalizedInput = email.trim().toLowerCase();
            const matchedUser = registeredUsers.find((user) => {
                const storedEmail = user.email?.toLowerCase();
                const storedUsername = user.username?.toLowerCase();
                return (storedEmail === normalizedInput || storedUsername === normalizedInput) && user.password === password;
            });

            const isValidLogin =
                (normalizedInput === "admin@gmail.com" || normalizedInput === "admin") && password === "admin123";

            if (matchedUser || isValidLogin) {
                const activeUser = matchedUser || {
                    fullName: "Admin",
                    email: normalizedInput,
                    userType: "Admin",
                };

                setMessage(`Welcome back, ${activeUser.fullName || activeUser.email}!`);
                setMessageType("success");
                window.setTimeout(() => {
                    onLoginSuccess(activeUser);
                    setIsLoading(false);
                }, 500);
            } else {
                setMessage("Invalid credentials. Please check your login details.");
                setMessageType("error");
                setIsLoading(false);
            }
        }, 1800);
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <p className="login-badge">Farm Connect</p>
                <h1>Welcome Back</h1>
                <p className="login-subtitle">Access your dashboard and farm updates securely.</p>
                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="text"
                        placeholder="Email or Username"
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
                        <button
                            type="button"
                            className="toggle-password-btn"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? "🙈" : "👁"}
                        </button>
                    </div>

                    <div className="login-actions">
                        <button type="submit" className="login-btn" disabled={isLoading}>
                            {isLoading ? "Loading..." : "Login"}
                        </button>
                        <button type="button" className="secondary-btn" onClick={handleClear} disabled={isLoading}>
                            Clear
                        </button>
                    </div>

                    <div className="login-links">
                        <button type="button" className="link-btn">
                            Forgot Password?
                        </button>
                        <button type="button" className="link-btn" onClick={onNavigateToRegistration}>
                            Create Account
                        </button>
                    </div>
                </form>
                {message && <p className={`login-message ${messageType}`}>{message}</p>}
            </div>
        </div>
    );
}

export default Login;
