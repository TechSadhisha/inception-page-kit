
import { useState, useEffect } from 'react';
import { useProjects } from './useProjects';
import { useProspects } from './useProspects';

interface OverviewMetrics {
  projectsTrend: { value: number; direction: 'up' | 'down' | 'neutral' };
  completedTrend: { value: number; direction: 'up' | 'down' | 'neutral' };
  prospectsTrend: { value: number; direction: 'up' | 'down' | 'neutral' };
  hotProspectsTrend: { value: number; direction: 'up' | 'down' | 'neutral' };
  projectStatusData: Array<{ name: string; value: number; color: string }>;
  prospectInterestData: Array<{ name: string; value: number; color: string }>;
}

export const useReports = () => {
  const { projects } = useProjects();
  const { prospects } = useProspects();
  const [overviewMetrics, setOverviewMetrics] = useState<OverviewMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (projects.length === 0 && prospects.length === 0) {
      setIsLoading(false);
      return;
    }

    // Calculate overview metrics
    const projectStatusData = [
      { 
        name: 'Planning', 
        value: projects.filter(p => p.status === 'planning').length, 
        color: '#FFBB28' 
      },
      { 
        name: 'Active', 
        value: projects.filter(p => p.status === 'active').length, 
        color: '#00C49F' 
      },
      { 
        name: 'Completed', 
        value: projects.filter(p => p.status === 'completed').length, 
        color: '#0088FE' 
      },
      { 
        name: 'On Hold', 
        value: projects.filter(p => p.status === 'on_hold').length, 
        color: '#FF8042' 
      },
    ];

    const prospectInterestData = [
      { name: '1 Star', value: prospects.filter(p => p.interest_rating === 1).length, color: '#FF8042' },
      { name: '2 Stars', value: prospects.filter(p => p.interest_rating === 2).length, color: '#FFBB28' },
      { name: '3 Stars', value: prospects.filter(p => p.interest_rating === 3).length, color: '#00C49F' },
      { name: '4 Stars', value: prospects.filter(p => p.interest_rating === 4).length, color: '#0088FE' },
      { name: '5 Stars', value: prospects.filter(p => p.interest_rating === 5).length, color: '#8884D8' },
    ];

    // Mock trend calculations (in a real app, you'd compare with historical data)
    const metrics: OverviewMetrics = {
      projectsTrend: { value: 12, direction: 'up' },
      completedTrend: { value: 8, direction: 'up' },
      prospectsTrend: { value: 15, direction: 'up' },
      hotProspectsTrend: { value: 20, direction: 'up' },
      projectStatusData,
      prospectInterestData,
    };

    setOverviewMetrics(metrics);
    setIsLoading(false);
  }, [projects, prospects]);

  return {
    overviewMetrics,
    isLoading,
  };
};
