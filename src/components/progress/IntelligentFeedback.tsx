
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Star, AlertCircle, Lightbulb, Clock, Award } from "lucide-react";
import { generateIntelligentFeedback } from "@/data/progressData";

export const IntelligentFeedback = () => {
  const feedback = generateIntelligentFeedback();

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'bg-green-500 text-white';
      case 'B+':
      case 'B':
        return 'bg-blue-500 text-white';
      case 'C+':
      case 'C':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-red-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Performance Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold ${getGradeColor(feedback.overall.grade)}`}>
                {feedback.overall.grade}
              </div>
              <div className="mt-2 text-sm text-gray-600">Overall Grade</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-2xl font-bold text-blue-600">
                <Clock className="h-6 w-6" />
                {feedback.overall.studyTime}m
              </div>
              <div className="text-sm text-gray-600">Avg Daily Study Time</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-2xl font-bold text-green-600">
                <Award className="h-6 w-6" />
                {feedback.overall.consistency}%
              </div>
              <div className="text-sm text-gray-600">Consistency Score</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-white/50 rounded-lg">
            <p className="text-center text-lg font-medium">
              {feedback.overall.message}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Strengths and Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Star className="h-5 w-5" />
              Your Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {feedback.strengths.map((strength, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <Star className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{strength}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertCircle className="h-5 w-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {feedback.improvements.map((improvement, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{improvement}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-600">
            <Lightbulb className="h-5 w-5" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedback.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <Lightbulb className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium">{recommendation}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">💡 Pro Tip:</h4>
            <p className="text-sm text-purple-700">
              Consistent daily practice, even for just 15-20 minutes, is more effective than longer, infrequent sessions. 
              Focus on your weakest areas while maintaining your strengths!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
