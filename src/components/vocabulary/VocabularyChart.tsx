
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface VocabularyStats {
  adjectives: number;
  nouns: number;
  verbs: number;
  adverbs: number;
  other: number;
}

interface VocabularyChartProps {
  stats: VocabularyStats;
}

export const VocabularyChart: React.FC<VocabularyChartProps> = ({ stats }) => {
  const data = [
    { name: "Adjectives", value: stats.adjectives, color: "#9b87f5" },
    { name: "Nouns", value: stats.nouns, color: "#33C3F0" },
    { name: "Verbs", value: stats.verbs, color: "#F06292" },
    { name: "Adverbs", value: stats.adverbs, color: "#AED581" },
    { name: "Other", value: stats.other, color: "#FFD54F" },
  ];

  const totalWords = Object.values(stats).reduce((sum, count) => sum + count, 0);

  return (
    <Card className="mb-4">
      <CardHeader>
        <h3 className="font-semibold">Vocabulary Progress</h3>
        <p className="text-sm text-gray-500">
          {totalWords} words learned
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} words`, '']} />
              <Legend 
                layout="vertical" 
                align="right"
                verticalAlign="middle"
                iconType="circle"
                iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
