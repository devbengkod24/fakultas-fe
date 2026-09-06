"use client";

import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataProfilLulusan } from "../../_components/landing-page/prospek-karir/profil-lulusan/table";
import { DataProfesiLulusan } from "../../_components/landing-page/prospek-karir/profesi-lulusan/table";

const ProspekKarirPage = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/admin" },
          { name: "Landing", url: "#" },
          {
            name: "Prospek Karir",
            url: "/admin/landing-page/prospek-karir",
          },
        ]}
        titleItems={[
          {
            title: "Prospek Karir",
            subtitle: "Kelola profil lulusan dan profesi/karir yang menanti lulusan program studi.",
          },
        ]}
      />

      <div className="mt-6">
        <Tabs defaultValue="profil-lulusan" className="w-full">
          <TabsList className="w-full justify-start bg-slate-100 border-b rounded-none px-4 h-auto py-2">
            <TabsTrigger
              value="profil-lulusan"
              className="data-[state=active]:bg-white data-[state=active]:text-primary rounded-md px-6 py-2"
            >
              Profil Lulusan
            </TabsTrigger>
            <TabsTrigger
              value="profesi-lulusan"
              className="data-[state=active]:bg-white data-[state=active]:text-primary rounded-md px-6 py-2"
            >
              Profesi Lulusan
            </TabsTrigger>
          </TabsList>
          
          <div className="p-4 bg-white border border-t-0 rounded-b-lg shadow-sm">
            <TabsContent value="profil-lulusan" className="mt-0 outline-none">
              <DataProfilLulusan />
            </TabsContent>
            <TabsContent value="profesi-lulusan" className="mt-0 outline-none">
              <DataProfesiLulusan />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default ProspekKarirPage;
