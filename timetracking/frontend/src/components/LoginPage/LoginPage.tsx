import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // CSSファイルのインポート
import logo from '../../assets/images/logo-universal.png'; // ロゴ画像のインポート

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // ログイン処理（API呼び出し等）をここに実装
        console.log('Logging in with:', email, password);
        // ログイン成功後のリダイレクトなど
    };

    return (
        <div className="login-container">
            <img src={logo} alt="Logo" className="login-logo" />
            <form onSubmit={handleLogin} className="login-form">
                <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="btn-login">Login</button>
            </form>
            <button onClick={() => navigate('/signup')} className="btn-signup">Sign Up</button>
        </div>
    );
};

export default LoginPage;