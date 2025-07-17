
import React from "react";
import { SkillRadarChart } from "./SkillRadarChart";
import { WeeklyProgressChart } from "./WeeklyProgressChart";
import { ModuleCompletionSection } from "./ModuleCompletionSection";
import { ModulePerformanceChart } from "./ModulePerformanceChart";
import { DailyPerformanceChart } from "./DailyPerformanceChart";
import { PerformanceAnalytics } from "./PerformanceAnalytics";
import { IntelligentFeedback } from "./IntelligentFeedback";
import { ComparativeAnalysis } from "./ComparativeAnalysis";

export const OverviewTabContent = () => {
  return (
    <div className="space-y-8">
      {/* AI Intelligent Feedback */}
      <IntelligentFeedback />
      
      {/* Daily Performance Tracking */}
      <DailyPerformanceChart />
      
      {/* Comparative Analysis */}
      <ComparativeAnalysis />
      
      {/* Performance Analytics */}
      <PerformanceAnalytics />
      
      {/* Original Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkillRadarChart />
        <WeeklyProgressChart />
      </div>
      
      <ModuleCompletionSection />
      <ModulePerformanceChart />
    </div>
  );
};
