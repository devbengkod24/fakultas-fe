"use client";

import { FileText, Beaker } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabsSectionProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsSection = ({ activeTab, setActiveTab }: TabsSectionProps) => {
  return (
    <>
      <Tabs
        defaultValue="artikel"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-2 h-12">
          <TabsTrigger
            value="artikel"
            className="flex items-center gap-1.5 bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors data-[state=active]:bg-primary-600 data-[state=active]:text-white text-sm py-2"
          >
            <FileText className="h-4 w-4" />
            Artikel
          </TabsTrigger>
          <TabsTrigger
            value="penelitian"
            className="flex items-center gap-1.5 bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors data-[state=active]:bg-primary-600 data-[state=active]:text-white text-sm py-2"
          >
            <Beaker className="h-4 w-4" />
            Penelitian
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </>
  );
};

export default TabsSection;
