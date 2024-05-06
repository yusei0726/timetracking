import React, { useState, useEffect } from 'react';
import './TimeTrackingPage.css';
import logo from '../../assets/images/logo-universal.png';
import { useIsLoggedIn } from '../common/CheckCurrentUser';
import { useUserId } from '../common/CheckCurrentUser';
import {useNavigate} from "react-router-dom";

const TimeTrackingPage: React.FC = () => {
    const [isWorking, setIsWorking] = useState(false);
    const [isOnBreak, setIsOnBreak] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [breakStartTime, setBreakStartTime] = useState<number | null>(null);
    const [workingSeconds, setWorkingSeconds] = useState(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const isLoggedIn = useIsLoggedIn();
    const navigate = useNavigate();
    const userId : string | null = useUserId();

    useEffect(() => {
        if (isLoggedIn === false) {
            navigate('/');
        }

        const interval = setInterval(() => {
            if (isWorking && !isOnBreak && startTime) {
                const current = new Date().getTime();
                let newWorkingSeconds = Math.floor((current - startTime) / 1000);
                if (isOnBreak && breakStartTime) {
                    newWorkingSeconds -= Math.floor((current - breakStartTime) / 1000);
                }
                setWorkingSeconds(newWorkingSeconds);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isWorking, isOnBreak, startTime, breakStartTime]);

    const handleClockIn = async () => {
        const currentTime = new Date().toISOString();
        if (!userId) {
            navigate('/');
        }
        try {
            const response = await fetch('http://localhost:8080/attendances/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: userId,
                    time_in: currentTime
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setIsWorking(true);
                setStartTime(Date.now());
                setBreakStartTime(null);
                setErrorMessage(null);
            } else if (response.status === 409) {
                setErrorMessage('you\'ve already working today.');
            } else {
                setErrorMessage('Failed to clock in. Please try again.');
            }
        } catch (error) {
            console.error('Error posting attendance:', error);
            setErrorMessage('Failed to clock in. Please try again.');
        }
    };

    const handleClockOut = async () => {
        const currentTime = new Date().toISOString();

        if (!userId) {
            navigate('/');
        }
        try {
            const response = await fetch('http://localhost:8080/attendances/end', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: userId,
                    time_out: currentTime
                })
            });

            const data = await response.json();
            console.log(data); // レスポンスの内容をログに出力
            setIsWorking(false);
        } catch (error) {
            console.error('Error posting attendance:', error);
        }
    };

    const handleBreakStart = async () => {
        const currentTime = new Date().toISOString();

        if (!userId) {
            navigate('/');
        }
        try {
            const response = await fetch('http://localhost:8080/breaks/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: userId,
                    break_start: currentTime
                })
            });

            const data = await response.json();
            console.log(data); // レスポンスの内容をログに出力
            setIsOnBreak(true);
            setBreakStartTime(Date.now());
        } catch (error) {
            console.error('Error posting attendance:', error);
        }
    };

    const handleBreakEnd = async () => {
        const currentTime = new Date().toISOString();

        if (!userId) {
            navigate('/');
        }
        try {
            const response = await fetch('http://localhost:8080/breaks/end', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: userId,
                    break_end: currentTime
                })
            });

            const data = await response.json();
            console.log(data); // レスポンスの内容をログに出力
            setIsOnBreak(false);
            setBreakStartTime(null);
        } catch (error) {
            console.error('Error posting attendance:', error);
        }
    };

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return [hours, minutes, seconds]
            .map(v => v < 10 ? "0" + v : v)
            .join(":");
    };

    return (
        <div className="timeTrackingPage-container">
            <img src={logo} alt="Logo" className="logo"/>
            <div className="working-hours-title">Working Hours</div>
            <div className="working-hours">
                {formatTime(workingSeconds)}
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <div className="clock-buttons">
                <button onClick={handleClockIn} disabled={isWorking || isOnBreak}>Clock In</button>
                <button onClick={handleClockOut} disabled={!isWorking || isOnBreak}>Clock Out</button>
            </div>
            <div className="break-buttons">
                <button onClick={handleBreakStart} disabled={!isWorking || isOnBreak}>Start Break</button>
                <button onClick={handleBreakEnd} disabled={!isOnBreak}>End Break</button>
            </div>
        </div>
    );
};

export default TimeTrackingPage;
