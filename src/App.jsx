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
        {[...Array(4)].map((_, i) =>
          [...Array(4)].map((_, j) => (
            <div key={`${i}-${j}`} className="cell" />
          ))
        )}
        {grid.flatMap((row, i) =>
          row.map((value, j) => 
            value ? (
              <div
                key={`${i}-${j}-${value}`}
                className={`tile tile-${value}`}
                style={{
                  transform: `translate(${j * 90 + 10}px, ${i * 90 + 10}px)`
                }}
              >
                {value}
              </div>
            ) : null
          )
        )}
      </div>
    </div>
  )
}

export default App
