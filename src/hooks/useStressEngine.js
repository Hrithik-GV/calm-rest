import { useState, useEffect } from 'react';
import { useTapIntensity } from './useTapIntensity';
import { useTouchStability } from './useTouchStability';
import { useMotionDetection } from './useMotionDetection';

/**
 * useStressEngine - Aggregates scores from individual detection hooks.
 * @param {boolean} isActive - Whether engine is active.
 * @returns {Object} { totalScore, tapScore, stabilityScore, motionScore, stressLevel }
 */
export const useStressEngine = (isActive) => {
    const tapScore = useTapIntensity(isActive);
    const stabilityScore = useTouchStability(isActive);
    const motionScore = useMotionDetection(isActive);

    const [engineState, setEngineState] = useState({
        totalScore: 0,
        stressLevel: 'Calm'
    });

    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(() => {
            const totalScore = tapScore + stabilityScore + motionScore;
            let stressLevel = 'Calm';

            if (totalScore >= 5) stressLevel = 'Elevated';
            else if (totalScore >= 3) stressLevel = 'Mild';

            setEngineState({
                totalScore,
                tapScore,
                stabilityScore,
                motionScore,
                stressLevel
            });

            console.log(`[StressEngine] Score: ${totalScore} (${stressLevel}) | T: ${tapScore} S: ${stabilityScore} M: ${motionScore}`);
        }, 5000);

        return () => clearInterval(interval);
    }, [isActive, tapScore, stabilityScore, motionScore]);

    return engineState;
};
