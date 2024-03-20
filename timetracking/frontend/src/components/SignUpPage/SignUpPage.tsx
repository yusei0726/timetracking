import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from 'aws-amplify/auth';
import { useIsLoggedIn } from '../common/CheckCurrentUser';
import './SignUpPage.css';
import logo from '../../assets/images/logo-universal.png';

const SignUpPage: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const isLoggedIn = useIsLoggedIn();

    useEffect(() => {
        if (isLoggedIn === true) {
            navigate('/timetracking');
        }
    }, [isLoggedIn, navigate]);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        if (password !== confirmPassword) {
            setErrorMessage('Password and Confirm Password do not match.');
            return;
        }

        try {
            const signUpResponse = await signUp({
                username: email,
                password,
                options: {
                    userAttributes: {
                        email
                    },
                    autoSignIn: true
                }
            });
            console.log(signUpResponse.isSignUpComplete);
            navigate('/signup/confirm');
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error signing up:', error.message);
                // Cognitoの特定のエラーコードに基づいて条件分岐
                if (error.message.includes('User already exists')) {
                    // ユーザーに既存のアカウントがあることを通知
                    alert('このメールアドレスは既に使用されています。ログインするか、別のメールアドレスを使用してください。');
                } else {
                    // その他のエラーについては汎用的なメッセージを表示
                    alert(error.message || JSON.stringify(error));
                }
            }
        }
    };

    return (
        <div className="signUp-container">
            <img src={logo} alt="Logo" className="logo"/>
            <form onSubmit={handleSignUp} className="signUp-form">
                <input
                    type="text" // Changed type from firstName to text
                    id="firstName"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <input
                    type="text" // Changed type from lastName to text
                    id="lastName"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
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
                <input
                    type="password" // Changed type from confirmPassword to password
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <div className="error-message">{errorMessage}</div>
                <button type="submit" className="btn-signup">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUpPage;