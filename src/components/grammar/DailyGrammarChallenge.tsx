
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, RefreshCw } from "lucide-react";

interface DailyGrammarChallengeProps {
  challenge: string;
  onNewChallenge: () => void;
}

const DailyGrammarChallenge = ({ challenge, onNewChallenge }: DailyGrammarChallengeProps) => {
  return (
    <Card className="border-t-4 border-yellow-500 bg-gradient-to-br from-yellow-50 to-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center">
          <BookOpen className="mr-2 h-5 w-5 text-yellow-600" />
          Daily Challenge
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 border border-yellow-200 rounded-md bg-yellow-50 mb-4">
          <p className="text-gray-700">{challenge}</p>
        </div>
        <Button 
          variant="outline" 
          onClick={onNewChallenge}
          className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white border-none gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Get New Challenge
        </Button>
      </CardContent>
    </Card>
  );
};

export default DailyGrammarChallenge;
