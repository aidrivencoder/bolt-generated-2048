import { useState, useCallback } from 'react'

const GRID_SIZE = 4

export function useGame() {
  const [grid, setGrid] = useState(() => {
    const initialGrid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0))
    return addNewTile(addNewTile(initialGrid))
  })
  
  const [score, setScore] = useState(0)

  function addNewTile(grid) {
    const availableCells = []
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] === 0) {
          availableCells.push({ x: i, y: j })
        }
      }
    }

    if (availableCells.length === 0) return grid

    const { x, y } = availableCells[Math.floor(Math.random() * availableCells.length)]
    const newGrid = grid.map(row => [...row])
    newGrid[x][y] = Math.random() < 0.9 ? 2 : 4
    return newGrid
  }

  function moveGrid(grid, direction) {
    let newGrid = grid.map(row => [...row])
    let moved = false
    let newScore = score

    const moveLeft = (row) => {
      const filtered = row.filter(cell => cell !== 0)
      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2
          newScore += filtered[i]
          filtered[i + 1] = 0
        }
      }
      const newRow = filtered.filter(cell => cell !== 0)
      return newRow.concat(Array(GRID_SIZE - newRow.length).fill(0))
    }

    if (direction === 'ArrowLeft') {
      newGrid = newGrid.map(row => {
        const newRow = moveLeft(row)
        if (JSON.stringify(newRow) !== JSON.stringify(row)) moved = true
        return newRow
      })
    } else if (direction === 'ArrowRight') {
      newGrid = newGrid.map(row => {
        const newRow = moveLeft([...row].reverse()).reverse()
        if (JSON.stringify(newRow) !== JSON.stringify(row)) moved = true
        return newRow
      })
    } else if (direction === 'ArrowUp') {
      const transposed = transposeGrid(newGrid)
      const movedGrid = transposed.map(row => moveLeft(row))
      newGrid = transposeGrid(movedGrid)
      if (JSON.stringify(newGrid) !== JSON.stringify(grid)) moved = true
    } else if (direction === 'ArrowDown') {
      const transposed = transposeGrid(newGrid)
      const movedGrid = transposed.map(row => moveLeft([...row].reverse()).reverse())
      newGrid = transposeGrid(movedGrid)
      if (JSON.stringify(newGrid) !== JSON.stringify(grid)) moved = true
    }

    if (moved) {
      newGrid = addNewTile(newGrid)
      setScore(newScore)
    }
    
    return newGrid
  }

  function transposeGrid(grid) {
    return grid[0].map((_, colIndex) => grid.map(row => row[colIndex]))
  }

  const handleKeyDown = useCallback((event) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault()
      setGrid(currentGrid => moveGrid(currentGrid, event.key))
    }
  }, [])

  return { grid, score, handleKeyDown }
}
