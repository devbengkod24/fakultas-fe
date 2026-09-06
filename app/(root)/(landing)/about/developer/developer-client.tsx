"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeroSection } from "@/app/(root)/components/hero-section";
import DeveloperCard from "./components/developer-card";
import TeamDescription from "./components/team-description";
import { team2023 } from "./data/team-2023";
import { team2022 } from "./data/team-2022";
import { TeamData } from "./data/types";
import { Users } from "lucide-react";

const getColorClasses = (color: string) => {
  const colorMap: Record<string, { bg: string; border: string; text: string; icon: string }> = {
    orange: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-600", icon: "text-orange-500" },
    blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-600", icon: "text-blue-500" },
    yellow: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-600", icon: "text-yellow-500" },
    green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-600", icon: "text-green-500" },
    purple: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-600", icon: "text-purple-500" },
    red: { bg: "bg-red-50", border: "border-red-200", text: "text-red-600", icon: "text-red-500" },
  };
  return colorMap[color] || colorMap.blue;
};

function TeamContent({ team, year }: { team: TeamData; year: string }) {
  // For 2023: General first, then small teams (TA, KP, BK), EWS last
  // For 2022: Original order (TA, KP, BK, General, Alumni)
  
  if (year === "2023") {
    const generalTeam = team.applications.find((app) => app.name.includes("General"));
    const ewsTeam = team.applications.find((app) => app.name.includes("Early Warning"));
    const smallTeams = team.applications.filter(
      (app) => !app.name.includes("General") && !app.name.includes("Early Warning")
    );

    return (
      <div className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {/* General Team First */}
          {generalTeam && (
            <div className="mb-8">
              <LargeTeamCard app={generalTeam} />
            </div>
          )}

          {/* Small Teams Grid (TA, KP, BK) */}
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {smallTeams.map((app, appIndex) => (
                <SmallTeamCard key={appIndex} app={app} />
              ))}
            </div>
          </div>

          {/* EWS Team Last */}
          {ewsTeam && (
            <div className="mb-8">
              <LargeTeamCard app={ewsTeam} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // For 2022: Original order
  return (
    <div className="py-8 lg:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {team.applications.map((app, appIndex) => (
            <SmallTeamCard key={appIndex} app={app} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SmallTeamCard({ app }: { app: TeamData["applications"][0] }) {
  const colors = getColorClasses(app.color);
  const Icon = app.icon;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 lg:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Application Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
        <div className={`p-2 rounded-lg ${colors.bg} ${colors.border} border`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
        <div>
          <h4 className="text-base font-semibold text-gray-800">{app.name}</h4>
          <p className="text-xs text-gray-500">Development Team</p>
        </div>
      </div>

      {/* Developers */}
      <div className="space-y-3">
        {app.developers.map((developer, devIndex) => (
          <DeveloperCard key={devIndex} developer={developer} color={app.color} />
        ))}
      </div>
    </div>
  );
}

function LargeTeamCard({ app }: { app: TeamData["applications"][0] }) {
  const colors = getColorClasses(app.color);
  const Icon = app.icon;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 lg:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Application Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className={`p-2 rounded-lg ${colors.bg} ${colors.border} border`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{app.name}</h3>
          <p className="text-sm text-gray-500">{app.developers.length} Developers</p>
        </div>
      </div>

      {/* Developers Grid - 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {app.developers.map((developer, devIndex) => (
          <DeveloperCard key={devIndex} developer={developer} color={app.color} />
        ))}
      </div>
    </div>
  );
}

export default function DeveloperClient() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSection
        variant="badge"
        title="Tim Developer"
        subtitle="Fakultas Ilmu Komputer - Universitas Dian Nuswantoro"
        badgeText="Development Team"
        badgeIcon="users"
      />

      {/* Tabs Section */}
      <main className="flex-grow bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 pt-8">
          <Tabs defaultValue="2023" className="w-full">
            {/* Tab List */}
            <div className="flex justify-center mb-8">
              <TabsList className="bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
                <TabsTrigger
                  value="2023"
                  className="px-6 py-2 rounded-lg data-[state=active]:bg-primary-600 data-[state=active]:text-white transition-all duration-200"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Bengkel Koding 2023
                </TabsTrigger>
                <TabsTrigger
                  value="2022"
                  className="px-6 py-2 rounded-lg data-[state=active]:bg-primary-600 data-[state=active]:text-white transition-all duration-200"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Bengkel Koding 2022
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content 2023 */}
            <TabsContent value="2023">
              <TeamContent team={team2023} year="2023" />
              <TeamDescription year="2023" />
            </TabsContent>

            {/* Tab Content 2022 */}
            <TabsContent value="2022">
              <TeamContent team={team2022} year="2022" />
              <TeamDescription year="2022" />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
