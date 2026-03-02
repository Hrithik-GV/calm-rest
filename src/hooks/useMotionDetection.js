import { useState, useEffect, useRef } from 'react';

/**
 * useMotionDetection - Monitors device motion for sudden acceleration spikes.
 * @param {boolean} isActive - Whether monitoring is active.
 * @returns {number} motionScore (0 or 1)
 */
export const useMotionDetection = (isActive) => {
    const [motionScore, setMotionScore] = useState(0);
    const lastSpike = useRef(0);

    useEffect(() => {
        if (!isActive) return;

        const handleMotion = (event) => {
            const { acceleration } = event;
            if (!acceleration) return;

            const totalAccel = Math.sqrt(
                (acceleration.x || 0) ** 2 +
                (acceleration.y || 0) ** 2 +
                (acceleration.z || 0) ** 2
            );

            if (totalAccel > 15) { // Threshold for a "spike"
                setMotionScore(1);
                lastSpike.current = Date.now();
            }
        };

        window.addEventListener('devicemotion', handleMotion);

        // Reset motion score if no spike for 3 seconds
        const interval = setInterval(() => {
            if (Date.now() - lastSpike.current > 3000) {
                setMotionScore(0);
            }
        }, 1000);

        return () => {
            window.removeEventListener('devicemotion', handleMotion);
            clearInterval(interval);
        };
    }, [isActive]);

    return motionScore;
};
