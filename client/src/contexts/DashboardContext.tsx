import React, { createContext, useContext, useState, useCallback } from 'react';

type DashboardType = 'worker' | 'client' | 'admin';

interface DashboardContextType {
  currentDashboard: DashboardType;
  setCurrentDashboard: (type: DashboardType) => void;
  dashboardHistory: DashboardType[];
  navigateBack: () => void;
  canNavigateBack: boolean;
  dashboardSettings: {
    [key in DashboardType]: {
      autoRefresh: boolean;
      refreshInterval: number;
    };
  };
  updateDashboardSettings: (
    type: DashboardType,
    settings: Partial<{
      autoRefresh: boolean;
      refreshInterval: number;
    }>
  ) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentDashboard, setCurrentDashboard] = useState<DashboardType>('worker');
  const [dashboardHistory, setDashboardHistory] = useState<DashboardType[]>(['worker']);
  const [settings, setSettings] = useState({
    worker: {
      autoRefresh: true,
      refreshInterval: 30000, // 30 seconds
    },
    client: {
      autoRefresh: true,
      refreshInterval: 60000, // 1 minute
    },
    admin: {
      autoRefresh: true,
      refreshInterval: 300000, // 5 minutes
    },
  });

  const handleDashboardChange = useCallback((type: DashboardType) => {
    setDashboardHistory((prev) => [...prev, type]);
    setCurrentDashboard(type);
  }, []);

  const navigateBack = useCallback(() => {
    if (dashboardHistory.length > 1) {
      const newHistory = dashboardHistory.slice(0, -1);
      setDashboardHistory(newHistory);
      setCurrentDashboard(newHistory[newHistory.length - 1]);
    }
  }, [dashboardHistory]);

  const updateDashboardSettings = useCallback(
    (
      type: DashboardType,
      newSettings: Partial<{
        autoRefresh: boolean;
        refreshInterval: number;
      }>
    ) => {
      setSettings((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          ...newSettings,
        },
      }));
    },
    []
  );

  const value = {
    currentDashboard,
    setCurrentDashboard: handleDashboardChange,
    dashboardHistory,
    navigateBack,
    canNavigateBack: dashboardHistory.length > 1,
    dashboardSettings: settings,
    updateDashboardSettings,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export default DashboardProvider;
