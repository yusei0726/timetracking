import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, type SignInInput } from 'aws-amplify/auth';
import './LoginPage.css';
import logo from '../../assets/images/logo-universal.png';
import { useIsLoggedIn } from '../common/CheckCurrentUser';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const isLoggedIn = useIsLoggedIn();

    useEffect(() => {
        if (isLoggedIn === true) {
            navigate('/timetracking');
        }
    }, [isLoggedIn, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        const signInInput: SignInInput = {
            username: email,
            password: password,
        };

        try {
            const user = await signIn(signInInput);
            console.log('Login successful:', user);
            navigate('/timetracking');
        } catch (error) {
            if (error instanceof Error) {
                if ( error.name === 'UserAlreadyAuthenticatedException') {
                    navigate('/timetracking');
                } else {
                    // 一般的なエラーメッセージの設定
                    setErrorMessage('Invalid email or password. Please try again.');
                }
            }
        }
    };

    return (
        <div className="login-container">
            <img src={logo} alt="Logo" className="logo"/>
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
                <div className="error-message">{errorMessage}</div>
                <button type="submit" className="btn-login">Login</button>
            </form>
            <button onClick={() => navigate('/signup')} className="btn-signup">Sign Up</button>
            <button onClick={() => navigate('/timetracking')} className="btn-signup">Time Tracking</button>
        </div>
    );
};

export default LoginPage;