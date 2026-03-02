import React, { useState, useEffect } from 'react';
import LandingScreen from './components/LandingScreen';
import CalmMode from './components/CalmMode';
import EthicalFooter from './components/EthicalFooter';
import { useStressEngine } from './hooks/useStressEngine';
import './App.css';

function App() {
  const [isCalmMode, setIsCalmMode] = useState(false);
  const stressEngine = useStressEngine(!isCalmMode);

  // Automatically activate Calm Mode if stress is elevated
  useEffect(() => {
    if (stressEngine.stressLevel === 'Elevated' && !isCalmMode) {
      setIsCalmMode(true);
    }
  }, [stressEngine.stressLevel, isCalmMode]);

  const handleSessionComplete = () => {
    setIsCalmMode(false);
  };

  return (
    <div className="app-container">
      {isCalmMode ? (
        <CalmMode
          onComplete={handleSessionComplete}
          tapScore={stressEngine.tapScore}
          stabilityScore={stressEngine.stabilityScore}
        />
      ) : (
        <LandingScreen />
      )}
      <EthicalFooter />
    </div>
  );
}

export default App;
