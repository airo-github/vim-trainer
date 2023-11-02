import React, { useState, useEffect } from 'react';
import vimShortcuts from './shortcutsData';

function App() {
  const [currentShortcut, setCurrentShortcut] = useState({});
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const getRandomShortcut = () => {
    const randomIndex = Math.floor(Math.random() * vimShortcuts.length);
    return vimShortcuts[randomIndex];
  };

  const handleShortcutSelection = (selectedKey) => {

    if (selectedKey === currentShortcut.key) {
      setScore(score + 1);
    }

    setCurrentShortcut(prev => {
      const newShortcut = getRandomShortcut();

      return {
        ...prev,
        // 入力したキーを保持  
        key: selectedKey,
        description: newShortcut.description
      };
    });

  };

  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(30);
    setShowResult(false);
    setScore(0);
    setCurrentShortcut(getRandomShortcut());
  };

  const endGame = () => {
    setGameStarted(false);
    setShowResult(true);
  };

  useEffect(() => {
    if (gameStarted) {
      const timer = setInterval(() => {
        if (timeLeft > 0) {
          setTimeLeft(timeLeft - 1);
        } else {
          clearInterval(timer);
          endGame();
        }
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [timeLeft, gameStarted]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted) {
        if (e.key === 'Enter') {
          startGame();
        }
      } else {
        handleShortcutSelection(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameStarted]);

  return (
    <div className="App">
      <h1>Vim Shortcut Trainer</h1>
      {showResult ? (
        <div className="result">
          <p>Your Score: {score}</p>
          <a href={`https://twitter.com/intent/tweet?text=I%20scored%20${score}%20in%20the%20Vim%20Shortcut%20Trainer%20app!&url=https://yourappurl.com`} target="_blank" rel="noopener noreferrer">
            Share on Twitter
          </a>
          <button onClick={startGame}>Restart</button>
        </div>
      ) : (
        <>
          <div className="shortcut-display">
            <p>Key: {currentShortcut.key}</p>
            <p>Description: {currentShortcut.description}</p>
          </div>
          <div className="user-input">
            <p>Press Enter to start...</p>
          </div>
          <div className="score">
            <p>Score: {score}</p>
          </div>
          <div className="timer">
            <p>Time Left: {timeLeft} seconds</p>
          </div>
        </>
      )}
    </div>
  );
}

export default App;

