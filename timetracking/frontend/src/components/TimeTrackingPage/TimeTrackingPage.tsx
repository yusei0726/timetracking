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
        setIsWorking(true);
        const currentTime = new Date().toISOString();
        setStartTime(Date.now());
        setBreakStartTime(null);

        if (userId) {
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

                const data = await response.json();
                console.log(data); // レスポンスの内容をログに出力
            } catch (error) {
                console.error('Error posting attendance:', error);
            }
        }
    };

    const handleClockOut = () => {
        setIsWorking(false);
        setIsOnBreak(false);
        setStartTime(null);
        setBreakStartTime(null);
        setWorkingSeconds(0);
    };

    const handleBreakStart = () => {
        setIsOnBreak(true);
        setBreakStartTime(Date.now());
    };

    const handleBreakEnd = () => {
        setIsOnBreak(false);
        setBreakStartTime(null);
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
            <div className="clock-buttons">
                <button onClick={handleClockIn} disabled={isWorking}>Clock In</button>
                <button onClick={handleClockOut} disabled={!isWorking}>Clock Out</button>
            </div>
            <div className="break-buttons">
                <button onClick={handleBreakStart} disabled={!isWorking || isOnBreak}>Start Break</button>
                <button onClick={handleBreakEnd} disabled={!isOnBreak}>End Break</button>
            </div>
        </div>
    );
};

export default TimeTrackingPage;
