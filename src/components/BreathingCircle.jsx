import React, { useEffect, useState } from 'react';
import './BreathingCircle.css';

const BreathingCircle = ({ tapScore, stabilityScore }) => {
    const [phase, setPhase] = useState('inhale'); // inhale, hold, exhale
    const [text, setText] = useState('Inhale...');

    // Adaptive durations based on stress scores
    const inhaleDuration = 4000 + (tapScore * 500); // Slower inhale if high tap intensity
    const holdDuration = 4000 + (stabilityScore * 1000); // Longer hold if unstable touch
    const exhaleDuration = 4000;

    useEffect(() => {
        let timeout;

        const runCycle = () => {
            // Inhale
            setPhase('inhale');
            setText('Inhale...');
            timeout = setTimeout(() => {
                // Hold
                setPhase('hold');
                setText('Hold...');
                timeout = setTimeout(() => {
                    // Exhale
                    setPhase('exhale');
                    setText('Exhale...');
                    timeout = setTimeout(runCycle, exhaleDuration);
                }, holdDuration);
            }, inhaleDuration);
        };

        runCycle();

        // Optional vibration for haptic feedback
        if (navigator.vibrate) {
            const vibrationInterval = setInterval(() => {
                navigator.vibrate(50);
            }, 4000);
            return () => {
                clearTimeout(timeout);
                clearInterval(vibrationInterval);
            };
        }

        return () => clearTimeout(timeout);
    }, [tapScore, stabilityScore]);

    return (
        <div className="breathing-container">
            <div className={`breathing-circle ${phase}`} style={{
                '--inhale-dur': `${inhaleDuration}ms`,
                '--hold-dur': `${holdDuration}ms`,
                '--exhale-dur': `${exhaleDuration}ms`
            }}></div>
            <div className="breathing-text">{text}</div>
        </div>
    );
};

export default BreathingCircle;
