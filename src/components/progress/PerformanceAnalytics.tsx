
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, Target, Award, Clock } from "lucide-react";
import { getPerformanceAnalytics } from "@/data/progressData";

export const PerformanceAnalytics = () => {
  const analytics = getPerformanceAnalytics();

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'text-green-600 bg-green-50';
      case 'declining':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Performance Analytics (Last 7 Days vs Previous 7 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analytics.map((module) => (
            <div key={module.module} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: module.color }}
                  />
                  <h3 className="font-semibold">{module.module}</h3>
                  {getTrendIcon(module.trend)}
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getTrendColor(module.trend)}`}>
                  {module.improvement > 0 ? '+' : ''}{module.improvement}%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-sm text-gray-600">Current (7 days)</div>
                  <div className="text-2xl font-bold" style={{ color: module.color }}>
                    {module.current}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Previous (7 days)</div>
                  <div className="text-2xl font-bold text-gray-500">
                    {module.previous}%
                  </div>
                </div>
              </div>

              <Progress 
                value={module.current} 
                className="h-2"
                style={{
                  background: `${module.color}20`
                }}
              />

              <div className="mt-2 text-xs text-gray-500">
                Performance trend: {module.trend}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
