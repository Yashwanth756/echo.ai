
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Trophy, Lightbulb, RotateCcw, RefreshCw, Moon, Sun, ArrowLeft } from 'lucide-react';
import { AlphabetSudokuRulebook } from './AlphabetSudokuRulebook';

type Difficulty = 'beginner' | 'intermediate' | 'advanced';
type ThemeWord = 'EDUCATION' | 'KNOWLEDGE' | 'LANGUAGE' | 'WORDPUZL';

interface GameConfig {
  size: number;
  subGridWidth: number;
  subGridHeight: number;
  letters: string[];
}

const GAME_CONFIGS: Record<Difficulty, GameConfig> = {
  beginner: { size: 4, subGridWidth: 2, subGridHeight: 2, letters: ['A', 'B', 'C', 'D'] },
  intermediate: { size: 6, subGridWidth: 3, subGridHeight: 2, letters: ['A', 'B', 'C', 'D', 'E', 'F'] },
  advanced: { size: 9, subGridWidth: 3, subGridHeight: 3, letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'] }
};

const THEME_WORDS: Record<ThemeWord, string[]> = {
  EDUCATION: ['E', 'D', 'U', 'C', 'A', 'T', 'I', 'O', 'N'],
  KNOWLEDGE: ['K', 'N', 'O', 'W', 'L', 'E', 'D', 'G', 'H'],
  LANGUAGE: ['L', 'A', 'N', 'G', 'U', 'E', 'S', 'C', 'H'],
  WORDPUZL: ['W', 'O', 'R', 'D', 'P', 'U', 'Z', 'L', 'E']
};

interface Cell {
  value: string;
  isFixed: boolean;
  isConflict: boolean;
  isHinted: boolean;
}

const AlphabetSudoku: React.FC = () => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'completed'>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [themeWord, setThemeWord] = useState<ThemeWord>('EDUCATION');
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [timer, setTimer] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [maxHints] = useState(3);
  const [showRulebook, setShowRulebook] = useState(false);

  const config = GAME_CONFIGS[difficulty];
  const letters = difficulty === 'advanced' ? THEME_WORDS[themeWord].slice(0, 9) : config.letters;

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  // Generate a solvable puzzle
  const generatePuzzle = (): Cell[][] => {
    const size = config.size;
    const newGrid: Cell[][] = Array(size).fill(null).map(() => 
      Array(size).fill(null).map(() => ({ 
        value: '', 
        isFixed: false, 
        isConflict: false, 
        isHinted: false 
      }))
    );

    // Fill diagonal sub-grids first (they don't interfere with each other)
    const { subGridWidth, subGridHeight } = config;
    for (let box = 0; box < size; box += Math.max(subGridWidth, subGridHeight)) {
      if (box + subGridWidth <= size && box + subGridHeight <= size) {
        fillSubGrid(newGrid, box, box, [...letters].sort(() => Math.random() - 0.5));
      }
    }

    // Solve the rest using backtracking
    solveSudoku(newGrid);

    // Remove some cells to create the puzzle
    const cellsToRemove = Math.floor(size * size * 0.6); // Remove 60% of cells
    const positions = [];
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        positions.push({ row: i, col: j });
      }
    }
    
    // Shuffle and remove cells
    positions.sort(() => Math.random() - 0.5);
    for (let i = 0; i < cellsToRemove; i++) {
      const { row, col } = positions[i];
      newGrid[row][col].value = '';
      newGrid[row][col].isFixed = false;
    }

    // Mark remaining cells as fixed
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (newGrid[i][j].value !== '') {
          newGrid[i][j].isFixed = true;
        }
      }
    }

    return newGrid;
  };

  const fillSubGrid = (grid: Cell[][], startRow: number, startCol: number, shuffledLetters: string[]) => {
    let index = 0;
    for (let i = 0; i < config.subGridHeight; i++) {
      for (let j = 0; j < config.subGridWidth; j++) {
        if (startRow + i < grid.length && startCol + j < grid[0].length) {
          grid[startRow + i][startCol + j].value = shuffledLetters[index++];
        }
      }
    }
  };

  const solveSudoku = (grid: Cell[][]): boolean => {
    const size = config.size;
    
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (grid[row][col].value === '') {
          for (const letter of letters) {
            if (isValidMove(grid, row, col, letter)) {
              grid[row][col].value = letter;
              if (solveSudoku(grid)) {
                return true;
              }
              grid[row][col].value = '';
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const isValidMove = (grid: Cell[][], row: number, col: number, letter: string): boolean => {
    const size = config.size;
    
    // Check row
    for (let j = 0; j < size; j++) {
      if (j !== col && grid[row][j].value === letter) return false;
    }
    
    // Check column
    for (let i = 0; i < size; i++) {
      if (i !== row && grid[i][col].value === letter) return false;
    }
    
    // Check sub-grid
    const boxRow = Math.floor(row / config.subGridHeight) * config.subGridHeight;
    const boxCol = Math.floor(col / config.subGridWidth) * config.subGridWidth;
    
    for (let i = boxRow; i < boxRow + config.subGridHeight; i++) {
      for (let j = boxCol; j < boxCol + config.subGridWidth; j++) {
        if ((i !== row || j !== col) && grid[i][j].value === letter) return false;
      }
    }
    
    return true;
  };

  const updateConflicts = (newGrid: Cell[][]) => {
    const size = config.size;
    
    // Reset conflicts
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        newGrid[i][j].isConflict = false;
      }
    }
    
    // Check for conflicts
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (newGrid[i][j].value !== '') {
          if (!isValidMove(newGrid, i, j, newGrid[i][j].value)) {
            newGrid[i][j].isConflict = true;
          }
        }
      }
    }
  };

  const startGame = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setGameState('playing');
    setTimer(0);
    setHintsUsed(0);
    setSelectedCell(null);
    
    const newGrid = generatePuzzle();
    updateConflicts(newGrid);
    setGrid(newGrid);
  };

  const handleCellClick = (row: number, col: number) => {
    if (grid[row][col].isFixed) return;
    setSelectedCell({ row, col });
  };

  const handleLetterInput = (letter: string) => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    const newGrid = [...grid];
    newGrid[row][col].value = letter;
    
    updateConflicts(newGrid);
    setGrid(newGrid);
    
    // Check if puzzle is completed
    if (isPuzzleComplete(newGrid)) {
      setGameState('completed');
    }
  };

  const isPuzzleComplete = (currentGrid: Cell[][]): boolean => {
    const size = config.size;
    
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (currentGrid[i][j].value === '' || currentGrid[i][j].isConflict) {
          return false;
        }
      }
    }
    return true;
  };

  const useHint = () => {
    if (hintsUsed >= maxHints || !selectedCell) return;
    
    const { row, col } = selectedCell;
    const newGrid = [...grid];
    
    // Find the correct letter for this cell
    for (const letter of letters) {
      if (isValidMove(newGrid, row, col, letter)) {
        newGrid[row][col].value = letter;
        newGrid[row][col].isHinted = true;
        updateConflicts(newGrid);
        setGrid(newGrid);
        setHintsUsed(prev => prev + 1);
        break;
      }
    }
  };

  const resetPuzzle = () => {
    const newGrid = grid.map(row => 
      row.map(cell => ({
        ...cell,
        value: cell.isFixed ? cell.value : '',
        isConflict: false,
        isHinted: false
      }))
    );
    setGrid(newGrid);
    setSelectedCell(null);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (showRulebook) {
    return <AlphabetSudokuRulebook onBack={() => setShowRulebook(false)} />;
  }

  if (gameState === 'menu') {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🎓 Alphabet Sudoku
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              The Word Logic Puzzle - Use letters instead of numbers. Train your mind. Build your vocabulary.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105" onClick={() => startGame('beginner')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <span className="text-2xl">🟢</span>
                    Beginner
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">4×4 grid with letters A-D</p>
                  <ul className="text-xs space-y-1">
                    <li>• 2×2 sub-grids</li>
                    <li>• Perfect for learning</li>
                    <li>• Quick games (2-5 min)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105" onClick={() => startGame('intermediate')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-600">
                    <span className="text-2xl">🟡</span>
                    Intermediate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">6×6 grid with letters A-F</p>
                  <ul className="text-xs space-y-1">
                    <li>• 3×2 sub-grids</li>
                    <li>• Moderate challenge</li>
                    <li>• Average games (5-15 min)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105" onClick={() => startGame('advanced')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <span className="text-2xl">🔴</span>
                    Advanced
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">9×9 grid with themed letters</p>
                  <ul className="text-xs space-y-1">
                    <li>• 3×3 sub-grids</li>
                    <li>• Expert challenge</li>
                    <li>• Long games (15-45 min)</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>🎨 Theme Word Selector (Advanced Mode)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.keys(THEME_WORDS).map((word) => (
                    <Button
                      key={word}
                      variant={themeWord === word ? "default" : "outline"}
                      onClick={() => setThemeWord(word as ThemeWord)}
                      className="h-auto py-3"
                    >
                      <div className="text-center">
                        <div className="font-bold">{word}</div>
                        <div className="text-xs opacity-70">{THEME_WORDS[word as ThemeWord].join('')}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-4 mb-8">
              <Button onClick={() => setShowRulebook(true)} variant="outline" size="lg">
                📚 How to Play
              </Button>
              <Button 
                onClick={() => setDarkMode(!darkMode)} 
                variant="outline" 
                size="icon"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'completed') {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-green-50 to-blue-50'}`}>
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold mb-4 text-green-600">Puzzle Completed!</h1>
          <div className="text-xl mb-8">
            <p>Time: {formatTime(timer)}</p>
            <p>Hints Used: {hintsUsed}/{maxHints}</p>
            <p>Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</p>
          </div>
          <div className="flex justify-center gap-4">
            <Button onClick={() => startGame(difficulty)} size="lg">
              <RefreshCw className="h-4 w-4 mr-2" />
              Play Again
            </Button>
            <Button onClick={() => setGameState('menu')} variant="outline" size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button onClick={() => setGameState('menu')} variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold">Alphabet Sudoku</h2>
              <p className="text-sm text-muted-foreground">
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} • {config.size}×{config.size}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              {formatTime(timer)}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Lightbulb className="h-4 w-4" />
              {hintsUsed}/{maxHints}
            </div>
            <Button 
              onClick={() => setDarkMode(!darkMode)} 
              variant="outline" 
              size="icon"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Game Grid */}
          <div className="flex-1">
            <Card>
              <CardContent className="p-6">
                <div 
                  className="grid gap-1 mx-auto w-fit"
                  style={{ 
                    gridTemplateColumns: `repeat(${config.size}, 1fr)`,
                    gridTemplateRows: `repeat(${config.size}, 1fr)` 
                  }}
                >
                  {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                      const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
                      const isInSameRow = selectedCell?.row === rowIndex;
                      const isInSameCol = selectedCell?.col === colIndex;
                      const isInSameBox = selectedCell && 
                        Math.floor(selectedCell.row / config.subGridHeight) === Math.floor(rowIndex / config.subGridHeight) &&
                        Math.floor(selectedCell.col / config.subGridWidth) === Math.floor(colIndex / config.subGridWidth);

                      return (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className={`
                            w-12 h-12 border border-gray-300 flex items-center justify-center cursor-pointer
                            font-bold text-lg transition-all duration-200
                            ${isSelected ? 'bg-blue-200 border-blue-500' : ''}
                            ${(isInSameRow || isInSameCol || isInSameBox) && !isSelected ? 'bg-blue-50' : ''}
                            ${cell.isFixed ? 'bg-gray-100 text-gray-800' : ''}
                            ${cell.isConflict ? 'bg-red-100 text-red-600 border-red-400' : ''}
                            ${cell.isHinted ? 'bg-green-100 text-green-600' : ''}
                            ${darkMode ? 'border-gray-600 text-white' : ''}
                            hover:bg-opacity-80
                          `}
                          onClick={() => handleCellClick(rowIndex, colIndex)}
                        >
                          {cell.value}
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="lg:w-80">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Letter Pad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {letters.map((letter) => (
                    <Button
                      key={letter}
                      onClick={() => handleLetterInput(letter)}
                      variant="outline"
                      className="h-12 text-lg font-bold"
                      disabled={!selectedCell || grid[selectedCell.row][selectedCell.col].isFixed}
                    >
                      {letter}
                    </Button>
                  ))}
                </div>
                <Button
                  onClick={() => selectedCell && handleLetterInput('')}
                  variant="outline"
                  className="w-full mt-2"
                  disabled={!selectedCell || grid[selectedCell?.row || 0][selectedCell?.col || 0]?.isFixed}
                >
                  Clear
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Game Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={useHint}
                  variant="outline"
                  className="w-full"
                  disabled={hintsUsed >= maxHints || !selectedCell}
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Use Hint ({hintsUsed}/{maxHints})
                </Button>
                <Button
                  onClick={resetPuzzle}
                  variant="outline"
                  className="w-full"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Puzzle
                </Button>
                <Button
                  onClick={() => startGame(difficulty)}
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  New Puzzle
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlphabetSudoku;
