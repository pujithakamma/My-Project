import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/api";
import "./Login.css";

function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("info");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    function handleClear() {
        setEmail("");
        setPassword("");
        setMessage("");
        setMessageType("info");
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!email.trim() || !password.trim()) {
            setMessage("Please enter both email and password.");
            setMessageType("error");
            return;
        }

        setIsLoading(true);
        setMessage("Checking your credentials...");
        setMessageType("info");

        try {
            const response = await loginUser(email, password);
            
            if (response.success) {
                setMessage(`Welcome back, ${response.user.fullName || response.user.email}!`);
                setMessageType("success");
                
                // Store user data in localStorage
                localStorage.setItem("farmConnectUser", JSON.stringify(response.user));
                
                setTimeout(() => {
                    onLoginSuccess?.(response.user);
                    navigate("/dashboard/overview", { replace: true });
                }, 500);
            }
        } catch (error) {
            setMessage(error.message || "Invalid credentials. Please check your login details.");
            setMessageType("error");
        } finally {
            setIsLoading(false);
        }
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
                            {showPassword ? "" : ""}
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
                        <button type="button" className="link-btn" onClick={() => navigate("/register")}>
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
