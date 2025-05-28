
import { TrendingUp, Gift, Star, User } from "lucide-react";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'rewards', label: 'Rewards', icon: Gift },
    { id: 'history', label: 'History', icon: Star },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === tab.id
              ? 'bg-gradient-to-r from-purple-500 to-amber-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <tab.icon className="h-4 w-4" />
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
