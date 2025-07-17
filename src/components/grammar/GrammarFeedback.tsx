
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface GrammarError {
  original: string;
  corrected: string;
  explanation: string;
  type: string;
}

interface GrammarFeedbackProps {
  text: string;
  score: number;
  errors: GrammarError[];
  suggestion: string;
}

const GrammarFeedback = ({ text, score, errors, suggestion }: GrammarFeedbackProps) => {
  return (
    <Card className="mb-8 border-t-4 border-primary">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Grammar Analysis</CardTitle>
        <Badge variant={score >= 80 ? "success" : score >= 60 ? "warning" : "destructive"} className="text-sm px-3 py-1">
          Score: {score}/100
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div 
              className={`h-2.5 rounded-full ${
                score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : "bg-red-500"
              }`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-2">Corrected Text:</h3>
          <div className="bg-green-50 p-4 rounded-md border border-green-200 text-green-800 relative">
            {text}
            {score === 100 && (
              <Badge variant="success" className="absolute -top-2 -right-2">
                Perfect!
              </Badge>
            )}
          </div>
        </div>

        {errors.length > 0 ? (
          <div className="mb-4">
            <h3 className="font-medium mb-2">Grammar Issues Found:</h3>
            {errors.map((error, index) => (
              <Alert key={index} className="mb-3 border-l-4 border-amber-500">
                <AlertTitle className="font-medium flex items-center">
                  <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                  {error.type}
                </AlertTitle>
                <AlertDescription className="grid gap-2 mt-2">
                  <div className="grid grid-cols-[auto_1fr] gap-2">
                    <span className="font-medium text-gray-700">Original:</span>
                    <span className="text-red-600 line-through decoration-red-600/50">{error.original}</span>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-2">
                    <span className="font-medium text-gray-700">Corrected:</span>
                    <span className="text-green-600 font-medium">{error.corrected}</span>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-2">
                    <span className="font-medium text-gray-700">Why:</span>
                    <span>{error.explanation}</span>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        ) : (
          <Alert className="mb-4 border-l-4 border-green-500 bg-green-50">
            <AlertTitle className="font-medium flex items-center">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              No major grammar issues found
            </AlertTitle>
            <AlertDescription>Great job! Your text looks good grammatically.</AlertDescription>
          </Alert>
        )}

        <div>
          <h3 className="font-medium mb-2">Suggestions for Improvement:</h3>
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200 text-blue-800">
            {suggestion}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GrammarFeedback;
