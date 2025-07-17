
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
import { getRandomMotivationalTip } from "@/lib/motivation";

export const MotivationalTipCard: React.FC = () => {
  const [tip, setTip] = useState('');

  useEffect(() => {
    // Get a random tip and update it daily
    const storedTip = localStorage.getItem('dailyTip');
    const storedDate = localStorage.getItem('dailyTipDate');
    const today = new Date().toDateString();

    if (storedTip && storedDate === today) {
      setTip(storedTip);
    } else {
      const newTip = getRandomMotivationalTip();
      setTip(newTip);
      localStorage.setItem('dailyTip', newTip);
      localStorage.setItem('dailyTipDate', today);
    }
  }, []);

  return (
    <Card className="animate-fade-in border-primary/20 bg-gradient-to-br from-primary/5 to-accent/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Award className="h-5 w-5" />
          <span>Daily Motivation</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="italic text-primary/80">{tip}</div>
      </CardContent>
    </Card>
  );
};
