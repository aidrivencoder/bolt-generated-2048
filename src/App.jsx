import React from 'react'
import { useGame } from './useGame'

function App() {
  const { grid, score, handleKeyDown } = useGame()

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="game-container">
      <div className="score">Score: {score}</div>
      <div className="grid">
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={`cell ${cell ? `tile-${cell}` : ''}`}
            >
              {cell || ''}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App
