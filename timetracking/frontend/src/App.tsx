import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import SignUpPage from './components/SignUpPage/SignUpPage';
import TimeTrackingPage from "./components/TimeTrackingPage/TimeTrackingPage";
import SignUpConfirmationPage from "./components/SignUpConfirmPage/SignUpConfirmPage";
import SignUpCompletePage from "./components/SignUpCompletePage/SignUpCompletePage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/timetracking" element={<TimeTrackingPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/signup/confirm" element={<SignUpConfirmationPage />} />
                <Route path="/signup/complete" element={<SignUpCompletePage />} />
            </Routes>
        </Router>
    );
}

export default App;
