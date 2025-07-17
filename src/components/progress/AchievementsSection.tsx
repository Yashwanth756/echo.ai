
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Award } from "lucide-react";

const achievements = [
  { name: "Wordsmith", description: "Learned 50+ vocabulary words", achieved: true },
  { name: "Grammar Guru", description: "Completed 10 grammar exercises", achieved: true },
  { name: "Fluent Speaker", description: "Practiced speaking for 5 hours", achieved: false },
  { name: "Storyteller", description: "Created 3 complete stories", achieved: true },
  { name: "Pronunciation Pro", description: "Mastered 20 difficult sounds", achieved: false },
  { name: "Quick Thinker", description: "Completed advanced reflex challenge", achieved: false },
];

export const AchievementsSection = () => {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-medium">Your Achievements</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border ${achievement.achieved ? 'bg-primary/10 border-primary/20' : 'bg-gray-100 border-gray-200'}`}
            >
              <div className="flex items-center gap-2">
                <Award className={`w-5 h-5 ${achievement.achieved ? 'text-primary' : 'text-gray-400'}`} />
                <h3 className={`font-medium ${achievement.achieved ? 'text-primary' : 'text-gray-500'}`}>
                  {achievement.name}
                </h3>
              </div>
              <p className="text-sm text-gray-600 mt-2">{achievement.description}</p>
              <div className={`text-xs mt-3 ${achievement.achieved ? 'text-primary' : 'text-gray-500'}`}>
                {achievement.achieved ? 'Achieved' : 'In Progress'}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
