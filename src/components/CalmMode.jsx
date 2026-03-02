import React, { useEffect, useState } from 'react';
import BreathingCircle from './BreathingCircle';
import './CalmMode.css';

const CalmMode = ({ onComplete, tapScore, stabilityScore }) => {
    const [timeLeft, setTimeLeft] = useState(60);
    const [isFinishing, setIsFinishing] = useState(false);

    useEffect(() => {
        if (timeLeft <= 0) {
            setIsFinishing(true);
            setTimeout(onComplete, 2000);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onComplete]);

    return (
        <div className={`calm-mode-overlay ${isFinishing ? 'fade-out' : 'fade-in'}`}>
            {!isFinishing ? (
                <>
                    <BreathingCircle tapScore={tapScore} stabilityScore={stabilityScore} />
                    <div className="calm-footer">
                        <button className="exit-btn" onClick={() => onComplete()}>Exit Session</button>
                        <p className="timer">{timeLeft}s remaining</p>
                    </div>
                </>
            ) : (
                <div className="completion-message">
                    <h2>You’re back in control.</h2>
                </div>
            )}
        </div>
    );
};

export default CalmMode;
