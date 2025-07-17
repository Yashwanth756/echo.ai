
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart, Pie, Cell, Label, Legend, Tooltip } from "recharts";
import { Badge } from "@/components/ui/badge";

// Colors for the donut chart
const COLORS = [
  '#9b87f5', // purple for nouns 
  '#5cb85c', // green for verbs
  '#f0ad4e', // orange for adjectives
  '#d9534f', // red for adverbs
  '#5bc0de', // blue for prepositions
  '#a879e0', // light purple for pronouns
  '#67c7a8'  // teal for conjunctions
];

interface PosData {
  nouns: string[];
  verbs: string[];
  adjectives: string[];
  adverbs: string[];
  prepositions: string[];
  pronouns: string[];
  conjunctions: string[];
}

interface PosChartData {
  name: string;
  value: number;
  count: number;
}

interface PartsOfSpeechAnalysisProps {
  posData: PosData;
  posChartData: PosChartData[];
}

const PartsOfSpeechAnalysis = ({ posData, posChartData }: PartsOfSpeechAnalysisProps) => {
  // Get total word count to calculate percentages
  const totalWords = posChartData.reduce((sum, item) => sum + item.count, 0);

  // Format labels with percentages
  const formattedChartData = posChartData.map(item => ({
    ...item,
    name: `${item.name} (${item.value.toFixed(1)}%)`,
    displayName: item.name
  }));

  return (
    <Card className="mb-8 border-t-4 border-indigo-500">
      <CardHeader>
        <CardTitle className="flex items-center">
          <span className="mr-2">Parts of Speech Analysis</span>
          <Badge variant="outline" className="text-xs">
            {totalWords} words analyzed
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-[280px] flex flex-col items-center justify-center">
            <ChartContainer 
              config={{
                nouns: { color: COLORS[0] },
                verbs: { color: COLORS[1] },
                adjectives: { color: COLORS[2] },
                adverbs: { color: COLORS[3] },
                prepositions: { color: COLORS[4] },
                pronouns: { color: COLORS[5] },
                conjunctions: { color: COLORS[6] },
              }}
            >
              <PieChart width={280} height={280}>
                <Pie
                  data={formattedChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="displayName"
                >
                  {formattedChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      stroke="#fff"
                      strokeWidth={1}
                    />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      const { cx, cy } = viewBox as any;
                      return (
                        <text x={cx} y={cy - 10} textAnchor="middle" dominantBaseline="middle" fontSize="14" fill="#333" fontWeight="500">
                          Word Types
                        </text>
                      );
                    }}
                  />
                  <Label
                    content={({ viewBox }) => {
                      const { cx, cy } = viewBox as any;
                      return (
                        <text x={cx} y={cy + 12} textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="#666">
                          {totalWords} words total
                        </text>
                      );
                    }}
                  />
                </Pie>
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                <Tooltip />
              </PieChart>
            </ChartContainer>
          </div>

          <div>
            <Tabs defaultValue="nouns" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4 w-full">
                <TabsTrigger value="nouns">Nouns</TabsTrigger>
                <TabsTrigger value="verbs">Verbs</TabsTrigger>
                <TabsTrigger value="adjectives">Adjectives</TabsTrigger>
                <TabsTrigger value="others">Others</TabsTrigger>
              </TabsList>
              
              <TabsContent value="nouns" className="p-4 border rounded-md bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Nouns</h3>
                  <Badge variant="outline" style={{backgroundColor: COLORS[0] + '20', color: COLORS[0]}}>
                    {posData.nouns.length} ({posData.nouns.length ? ((posData.nouns.length / totalWords) * 100).toFixed(1) : 0}%)
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {posData.nouns.length > 0 ? posData.nouns.map((noun, index) => (
                    <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">{noun}</span>
                  )) : <span className="text-gray-500 text-sm">No nouns detected</span>}
                </div>
              </TabsContent>
              
              <TabsContent value="verbs" className="p-4 border rounded-md bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Verbs</h3>
                  <Badge variant="outline" style={{backgroundColor: COLORS[1] + '20', color: COLORS[1]}}>
                    {posData.verbs.length} ({posData.verbs.length ? ((posData.verbs.length / totalWords) * 100).toFixed(1) : 0}%)
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {posData.verbs.length > 0 ? posData.verbs.map((verb, index) => (
                    <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">{verb}</span>
                  )) : <span className="text-gray-500 text-sm">No verbs detected</span>}
                </div>
              </TabsContent>
              
              <TabsContent value="adjectives" className="p-4 border rounded-md bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Adjectives</h3>
                  <Badge variant="outline" style={{backgroundColor: COLORS[2] + '20', color: COLORS[2]}}>
                    {posData.adjectives.length} ({posData.adjectives.length ? ((posData.adjectives.length / totalWords) * 100).toFixed(1) : 0}%)
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {posData.adjectives.length > 0 ? posData.adjectives.map((adj, index) => (
                    <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">{adj}</span>
                  )) : <span className="text-gray-500 text-sm">No adjectives detected</span>}
                </div>
              </TabsContent>
              
              <TabsContent value="others" className="p-4 border rounded-md bg-gray-50 max-h-[250px] overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Adverbs</h3>
                      <Badge variant="outline" style={{backgroundColor: COLORS[3] + '20', color: COLORS[3]}}>
                        {posData.adverbs.length} ({posData.adverbs.length ? ((posData.adverbs.length / totalWords) * 100).toFixed(1) : 0}%)
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {posData.adverbs.length > 0 ? posData.adverbs.map((adv, index) => (
                        <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">{adv}</span>
                      )) : <span className="text-gray-500 text-sm">No adverbs detected</span>}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Prepositions</h3>
                      <Badge variant="outline" style={{backgroundColor: COLORS[4] + '20', color: COLORS[4]}}>
                        {posData.prepositions.length} ({posData.prepositions.length ? ((posData.prepositions.length / totalWords) * 100).toFixed(1) : 0}%)
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {posData.prepositions.length > 0 ? posData.prepositions.map((prep, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{prep}</span>
                      )) : <span className="text-gray-500 text-sm">No prepositions detected</span>}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Pronouns</h3>
                      <Badge variant="outline" style={{backgroundColor: COLORS[5] + '20', color: COLORS[5]}}>
                        {posData.pronouns.length} ({posData.pronouns.length ? ((posData.pronouns.length / totalWords) * 100).toFixed(1) : 0}%)
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {posData.pronouns.length > 0 ? posData.pronouns.map((pron, index) => (
                        <span key={index} className="bg-violet-100 text-violet-800 px-2 py-1 rounded text-sm">{pron}</span>
                      )) : <span className="text-gray-500 text-sm">No pronouns detected</span>}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Conjunctions</h3>
                      <Badge variant="outline" style={{backgroundColor: COLORS[6] + '20', color: COLORS[6]}}>
                        {posData.conjunctions.length} ({posData.conjunctions.length ? ((posData.conjunctions.length / totalWords) * 100).toFixed(1) : 0}%)
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {posData.conjunctions.length > 0 ? posData.conjunctions.map((conj, index) => (
                        <span key={index} className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-sm">{conj}</span>
                      )) : <span className="text-gray-500 text-sm">No conjunctions detected</span>}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PartsOfSpeechAnalysis;
