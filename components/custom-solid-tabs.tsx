import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

interface TabItem {
  status: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab?: string;
  onTabChange: (status: string) => void;
}

export function CustomSolidTabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <Tabs
      defaultValue={activeTab ?? tabs[0]?.status}
      onValueChange={onTabChange}
      className="!h-full"
    >
      <TabsList className="space-x-2">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.status}
            onClick={() => onTabChange(tab.status)}
            value={tab.status}
            className="border data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:border-primary data-[state=active]:bg-primary bg-white rounded-lg p-1.5 !px-4 text-gray-600 hover:text-primary hover:border-primary data-[state=active]:hover:text-white data-[state=active]:hover:bg-primary"
          >
            {tab.icon && <tab.icon className="mr-2 h-4 w-4" />}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
