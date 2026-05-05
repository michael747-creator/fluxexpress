import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Logo from "../../components/Logo";
import "../../admin/styles/admin.css";

function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/admin/dashboard");
        } catch (err) {
            console.error("Login failed:", err);
            setError("Authentication failed. Ensure you have registered this admin email in the Firebase Console.");
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">
                <div className="admin-login-logo">
                    <Logo size={48} showText={true} />
                    <p style={{ marginTop: '0.5rem' }}>Log in to access the secure control panel</p>
                </div>
                <form className="admin-login-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Admin Email</label>
                        <input 
                            type="email" 
                            placeholder="admin@fluxexpress.com"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    {error && <p className="login-error">{error}</p>}
                    <button type="submit" className="admin-login-btn">Sign In to Dashboard</button>
                </form>
                <p className="admin-login-hint">Forgot credentials? Contact <span>IT Support</span></p>
            </div>
        </div>
    );
}

export default AdminLogin;
