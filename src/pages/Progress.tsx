import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Calendar, BarChart2 } from "lucide-react";
import { OverviewTabContent } from "@/components/progress/OverviewTabContent";
import { ActivityLogSection } from "@/components/progress/ActivityLogSection";
import { AchievementsSection } from "@/components/progress/AchievementsSection";

const Progress = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <AppLayout>
      <div className="min-h-screen bg-background flex flex-col md:flex-row w-full">
        {/* <AppSidebar /> */}

        <div className="flex-1 flex flex-col items-center px-4 py-6 sm:px-6 md:py-8 ">
          {/* Header */}
          <header className="w-full max-w-6xl mb-6 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-primary mb-2 break-words">
              Progress Report
            </h1>
            <p className="text-gray-600 text-sm sm:text-base break-words">
              Track your English learning journey across all modules
            </p>
          </header>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full max-w-6xl"
          >
            {/* Responsive Tabs List */}
            <TabsList className="flex flex-wrap justify-between gap-2 mb-12 sm:justify-start">
              <TabsTrigger
                value="overview"
                className="flex items-center gap-2 justify-center px-3 py-2 text-sm sm:text-base whitespace-nowrap"
              >
                <BarChart2 className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="detailed"
                className="flex items-center gap-2 justify-center px-3 py-2 text-sm sm:text-base whitespace-nowrap"
              >
                <Calendar className="h-4 w-4" />
                <span>Activity Log</span>
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="flex items-center gap-2 justify-center px-3 py-2 text-sm sm:text-base whitespace-nowrap"
              >
                <Award className="h-4 w-4" />
                <span>Achievements</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Contents */}
            <TabsContent value="overview" className="space-y-6">
              <OverviewTabContent />
            </TabsContent>

            <TabsContent value="detailed" className="space-y-6">
              <ActivityLogSection />
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <AchievementsSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default Progress;
