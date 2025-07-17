
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

interface AlphabetSudokuRulebookProps {
  onBack: () => void;
}

export const AlphabetSudokuRulebook: React.FC<AlphabetSudokuRulebookProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button onClick={onBack} variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📚 How to Play Alphabet Sudoku
          </h1>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* What is Alphabet Sudoku */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">🎯 What is Alphabet Sudoku?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-4">
                Alphabet Sudoku (also known as "Wordoku") is a fun logic puzzle where you fill a grid using unique letters instead of numbers, following classic Sudoku rules.
              </p>
              <p className="text-muted-foreground">
                It combines the logical thinking of traditional Sudoku with the educational benefits of working with letters, making it perfect for word lovers and puzzle enthusiasts alike.
              </p>
            </CardContent>
          </Card>

          {/* Objective */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-green-600">🎲 Objective</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-4">Fill the entire grid using a specific set of letters so that:</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Each <strong>row</strong> contains all letters once</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Each <strong>column</strong> contains all letters once</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Each <strong>sub-grid (box)</strong> contains all letters once</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How to Play */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-purple-600">🎮 How to Play</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">Choose a difficulty level</h4>
                    <p className="text-muted-foreground">Beginner (4×4), Intermediate (6×6), or Advanced (9×9)</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Observe the given letters</h4>
                    <p className="text-muted-foreground">Some letters are already placed — use logic to fill in the rest</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Select and fill cells</h4>
                    <p className="text-muted-foreground">Tap a cell to select it, then tap a letter from the virtual keyboard</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
                  <div>
                    <h4 className="font-semibold">Follow the rules</h4>
                    <p className="text-muted-foreground">No letter can repeat in a row, column, or box</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold">5</div>
                  <div>
                    <h4 className="font-semibold">Use hints wisely</h4>
                    <p className="text-muted-foreground">You have a limited number of hints if you get stuck</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Examples */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-orange-600">📝 Examples</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3">For a 4×4 grid with letters A, B, C, D:</h4>
                  
                  <div className="mb-4">
                    <p className="font-medium mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Valid row example:
                    </p>
                    <div className="grid grid-cols-4 gap-1 w-fit">
                      <div className="w-8 h-8 bg-green-100 border border-green-300 flex items-center justify-center font-bold">A</div>
                      <div className="w-8 h-8 bg-green-100 border border-green-300 flex items-center justify-center font-bold">B</div>
                      <div className="w-8 h-8 bg-green-100 border border-green-300 flex items-center justify-center font-bold">C</div>
                      <div className="w-8 h-8 bg-green-100 border border-green-300 flex items-center justify-center font-bold">D</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="font-medium mb-2 flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      Invalid row example (A appears twice):
                    </p>
                    <div className="grid grid-cols-4 gap-1 w-fit">
                      <div className="w-8 h-8 bg-red-100 border border-red-300 flex items-center justify-center font-bold">A</div>
                      <div className="w-8 h-8 bg-red-100 border border-red-300 flex items-center justify-center font-bold">B</div>
                      <div className="w-8 h-8 bg-red-100 border border-red-300 flex items-center justify-center font-bold">A</div>
                      <div className="w-8 h-8 bg-red-100 border border-red-300 flex items-center justify-center font-bold">D</div>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Valid 2×2 sub-grid example:
                    </p>
                    <div className="grid grid-cols-2 gap-1 w-fit">
                      <div className="w-8 h-8 bg-blue-100 border border-blue-300 flex items-center justify-center font-bold">A</div>
                      <div className="w-8 h-8 bg-blue-100 border border-blue-300 flex items-center justify-center font-bold">C</div>
                      <div className="w-8 h-8 bg-blue-100 border border-blue-300 flex items-center justify-center font-bold">D</div>
                      <div className="w-8 h-8 bg-blue-100 border border-blue-300 flex items-center justify-center font-bold">B</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips and Strategies */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-indigo-600">💡 Tips & Strategies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">1</div>
                  <div>
                    <h4 className="font-semibold">Use process of elimination</h4>
                    <p className="text-muted-foreground">Look at which letters are already used in a row, column, or box to narrow down possibilities</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">2</div>
                  <div>
                    <h4 className="font-semibold">Start with constrained cells</h4>
                    <p className="text-muted-foreground">Focus on cells that have fewer possible letter options</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">3</div>
                  <div>
                    <h4 className="font-semibold">Check for single candidates</h4>
                    <p className="text-muted-foreground">If only one letter can go in a specific cell, place it immediately</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">4</div>
                  <div>
                    <h4 className="font-semibold">Use hints strategically</h4>
                    <p className="text-muted-foreground">Save hints for when you're truly stuck, as they're limited per game</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">5</div>
                  <div>
                    <h4 className="font-semibold">Stay organized</h4>
                    <p className="text-muted-foreground">Work systematically through rows, columns, or boxes rather than randomly jumping around</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Difficulty Levels */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-teal-600">📊 Difficulty Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-bold text-green-700 mb-2">🟢 Beginner</h4>
                  <ul className="text-sm space-y-1 text-green-600">
                    <li>• 4×4 grid</li>
                    <li>• Letters A, B, C, D</li>
                    <li>• 2×2 sub-grids</li>
                    <li>• Quick 2-5 minute games</li>
                    <li>• Perfect for learning</li>
                  </ul>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-bold text-yellow-700 mb-2">🟡 Intermediate</h4>
                  <ul className="text-sm space-y-1 text-yellow-600">
                    <li>• 6×6 grid</li>
                    <li>• Letters A, B, C, D, E, F</li>
                    <li>• 3×2 sub-grids</li>
                    <li>• 5-15 minute games</li>
                    <li>• Good for practice</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-bold text-red-700 mb-2">🔴 Advanced</h4>
                  <ul className="text-sm space-y-1 text-red-600">
                    <li>• 9×9 grid</li>
                    <li>• Letters from themed words</li>
                    <li>• 3×3 sub-grids</li>
                    <li>• 15-45 minute games</li>
                    <li>• Expert challenge</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Educational Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-pink-600">🧠 Educational Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold mb-3 text-pink-700">Cognitive Skills</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Logical reasoning</li>
                    <li>• Pattern recognition</li>
                    <li>• Problem-solving</li>
                    <li>• Concentration and focus</li>
                    <li>• Memory enhancement</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-3 text-pink-700">Language Skills</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Letter recognition</li>
                    <li>• Alphabet familiarity</li>
                    <li>• Vocabulary building (themed words)</li>
                    <li>• Visual letter processing</li>
                    <li>• Spelling pattern awareness</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button onClick={onBack} size="lg" className="px-8">
              Ready to Play! 🎯
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
