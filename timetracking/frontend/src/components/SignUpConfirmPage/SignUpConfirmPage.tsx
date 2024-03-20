import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { confirmSignUp } from 'aws-amplify/auth';
import { autoSignIn } from 'aws-amplify/auth';
import { useIsLoggedIn } from '../common/CheckCurrentUser';
import logo from "../../assets/images/logo-universal.png";
import './SignUpConfirmationPage.css';

const SignUpConfirmationPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [confirmationCode, setConfirmationCode] = useState('');
    const navigate = useNavigate();
    const isLoggedIn = useIsLoggedIn();

    useEffect(() => {
        if (isLoggedIn === true) {
            navigate('/timetracking');
        }
    }, [isLoggedIn, navigate]);

    const handleSignUpConfirmation = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await confirmSignUp({
                username,
                confirmationCode,
            });
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error confirming sign up:', error.message);
                alert(error.message || JSON.stringify(error));
            }
        }
        await handleAutoSignIn();
        navigate('/signup/complete');
    };

    async function handleAutoSignIn() {
        try {
            await autoSignIn();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="signUpConfirmation-container">
            <img src={logo} alt="Logo" className="logo"/>
            <h2>Confirm Sign Up</h2>
            <form onSubmit={handleSignUpConfirmation} className="signUpConfirmation-form">
                <input
                    type="text"
                    id="username"
                    placeholder="Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="text"
                    id="confirmationCode"
                    placeholder="Confirmation Code"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                    required
                />
                <button type="submit" className="btn-confirm">Confirm Sign Up</button>
            </form>
            <button type="submit" className="btn-resend-code">Resend Code</button>
        </div>
    );
};

export default SignUpConfirmationPage;