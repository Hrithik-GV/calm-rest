import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useTouchStability - Analyzes pointermove events for jitter and chaotic movement.
 * @param {boolean} isActive - Whether monitoring is active.
 * @returns {number} stabilityScore (0, 1, or 2)
 */
export const useTouchStability = (isActive) => {
    const [stabilityScore, setStabilityScore] = useState(0);
    const movements = useRef([]);
    const isTouching = useRef(false);

    const handlePointerDown = () => (isTouching.current = true);
    const handlePointerUp = () => {
        isTouching.current = false;
        movements.current = [];
    };

    const handlePointerMove = useCallback((e) => {
        if (!isActive || !isTouching.current) return;

        const { clientX, clientY, timeStamp } = e;
        const prev = movements.current[movements.current.length - 1];

        if (prev) {
            const dx = clientX - prev.x;
            const dy = clientY - prev.y;
            const dt = timeStamp - prev.t;
            const speed = Math.sqrt(dx * dx + dy * dy) / (dt || 1);

            movements.current.push({ x: clientX, y: clientY, t: timeStamp, speed, dx, dy });
            if (movements.current.length > 20) movements.current.shift();
        } else {
            movements.current.push({ x: clientX, y: clientY, t: timeStamp, speed: 0, dx: 0, dy: 0 });
        }
    }, [isActive]);

    useEffect(() => {
        if (!isActive) return;

        window.addEventListener('pointerdown', handlePointerDown);
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointercancel', handlePointerUp);

        return () => {
            window.removeEventListener('pointerdown', handlePointerDown);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
            window.removeEventListener('pointercancel', handlePointerUp);
        };
    }, [isActive, handlePointerMove]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (movements.current.length < 5) {
                setStabilityScore(0);
                return;
            }

            // Calculate speed variance and direction changes
            let speedVariance = 0;
            let directionChanges = 0;
            const avgSpeed = movements.current.reduce((sum, m) => sum + m.speed, 0) / movements.current.length;

            for (let i = 1; i < movements.current.length; i++) {
                const m = movements.current[i];
                const prevM = movements.current[i - 1];
                speedVariance += Math.abs(m.speed - avgSpeed);

                // Simple jitter/direction change detection
                if (Math.sign(m.dx) !== Math.sign(prevM.dx) || Math.sign(m.dy) !== Math.sign(prevM.dy)) {
                    directionChanges++;
                }
            }

            if (directionChanges > 10 || speedVariance > 5) setStabilityScore(2);
            else if (directionChanges > 5 || speedVariance > 2) setStabilityScore(1);
            else setStabilityScore(0);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return stabilityScore;
};
