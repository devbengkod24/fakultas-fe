import { Badge } from "./ui/badge";

interface TabItem {
  status: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (status: string) => void;
}

export function CustomTabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="w-full border-b">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.status}
            onClick={() => onTabChange(tab.status)}
            className={`flex items-center px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === tab.status
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            {tab.icon && <tab.icon className="mr-2 h-4 w-4" />}
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 size-5 px-2 flex justify-center items-center"
              >
                {tab.count}
              </Badge>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
