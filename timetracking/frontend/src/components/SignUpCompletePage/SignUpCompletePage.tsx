import React, { useEffect } from 'react';
import logo from "../../assets/images/logo-universal.png";
import './SignUpCompletePage.css';
import {useNavigate} from "react-router-dom";

const SignUpCompletePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="signUpCompletePage-container">
            <img src={logo} alt="Logo" className="logo"/>
            <h2>Sign Up Complete!!</h2>
            <button onClick={() => navigate('/timetracking')} className="btn-signup">GoTo My Page</button>
        </div>
    );
};

export default SignUpCompletePage;