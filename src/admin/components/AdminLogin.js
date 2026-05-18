import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import "../../admin/styles/login.css";

const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "fluxexpress123"
};

function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Simulate network delay for UX
        await new Promise(resolve => setTimeout(resolve, 800));

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            localStorage.setItem('fluxAdminToken', 'fluxexpress-admin-' + Date.now());
            navigate("/admin/dashboard");
        } else {
            setError("Invalid administrator credentials. Please verify and try again.");
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <div className="admin-login-logo">
                        <Logo size={64} showText={false} />
                    </div>
                    <h1 className="admin-login-title">Administrator Portal</h1>
                    <p className="admin-login-subtitle">Please authenticate to access the operations dashboard</p>
                </div>

                {error && <div className="login-error-msg">{error}</div>}

                <form className="admin-login-form" onSubmit={handleLogin}>
                    <div className="form-field">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-submit-btn"
                        disabled={loading}
                    >
                        {loading ? "Authenticating..." : "Sign In to Dashboard"}
                    </button>
                </form>

                <div className="login-credential-tip">
                    <div className="tip-label">DEMO ACCESS</div>
                    <div className="tip-values">
                        User: <strong>admin</strong> | Pass: <strong>fluxexpress123</strong>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
