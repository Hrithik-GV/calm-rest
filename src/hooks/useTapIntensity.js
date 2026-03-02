import { useState, useEffect, useCallback } from 'react';

/**
 * useTapIntensity - Monitors pointerdown events to calculate tap intensity.
 * @param {boolean} isActive - Whether monitoring is active.
 * @returns {number} tapScore (0, 1, or 2)
 */
export const useTapIntensity = (isActive) => {
    const [tapScore, setTapScore] = useState(0);
    const [taps, setTaps] = useState([]);

    const handlePointerDown = useCallback(() => {
        if (!isActive) return;
        const now = Date.now();
        setTaps((prev) => [...prev.filter(t => now - t < 3000), now]);
    }, [isActive]);

    useEffect(() => {
        if (!isActive) return;
        window.addEventListener('pointerdown', handlePointerDown);
        return () => window.removeEventListener('pointerdown', handlePointerDown);
    }, [isActive, handlePointerDown]);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const recentTaps = taps.filter(t => now - t < 3000).length;

            if (recentTaps >= 9) setTapScore(2);
            else if (recentTaps >= 4) setTapScore(1);
            else setTapScore(0);
        }, 1000);

        return () => clearInterval(interval);
    }, [taps]);

    return tapScore;
};
