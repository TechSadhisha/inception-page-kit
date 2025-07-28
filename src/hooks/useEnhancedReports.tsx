
import { useState, useEffect } from 'react'
import { useProjects } from './useProjects'
import { useProspects } from './useProspects'
import { useGoogleSheetsData } from './useGoogleSheetsData'

interface EnhancedMetrics {
  projectsTrend: { value: number; direction: 'up' | 'down' | 'neutral' }
  completedTrend: { value: number; direction: 'up' | 'down' | 'neutral' }
  prospectsTrend: { value: number; direction: 'up' | 'down' | 'neutral' }
  hotProspectsTrend: { value: number; direction: 'up' | 'down' | 'neutral' }
  projectStatusData: Array<{ name: string; value: number; color: string }>
  prospectInterestData: Array<{ name: string; value: number; color: string }>
  sheetsIntegrationData: Array<{ name: string; value: number; color: string }>
  sheetsMetrics: any[]
}

export const useEnhancedReports = () => {
  const { projects } = useProjects()
  const { prospects } = useProspects()
  const { sheetsData, prospectClients, isLoading: sheetsLoading, refreshSheetsData, calculateSheetMetrics, exportProspectClients } = useGoogleSheetsData()
  const [enhancedMetrics, setEnhancedMetrics] = useState<EnhancedMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Mock project sheets for demo - in real app, this would come from useProjectSheets
  const mockProjectSheets = [
    {
      id: '1',
      project_id: 'proj-1',
      sheet_id: 'sheet-1',
      sheet_name: 'Green Tab - Prospects',
      sheet_url: 'https://docs.google.com/spreadsheets/d/demo/edit'
    },
    {
      id: '2',
      project_id: 'proj-2',
      sheet_id: 'sheet-2',
      sheet_name: 'Project Data',
      sheet_url: 'https://docs.google.com/spreadsheets/d/demo2/edit'
    }
  ]

  useEffect(() => {
    const loadEnhancedData = async () => {
      setIsLoading(true)
      
      try {
        // Refresh sheets data with mock data for demo
        await refreshSheetsData(mockProjectSheets)

        // Calculate enhanced metrics
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
        ]

        const prospectInterestData = [
          { name: '1 Star', value: prospects.filter(p => p.interest_rating === 1).length, color: '#FF8042' },
          { name: '2 Stars', value: prospects.filter(p => p.interest_rating === 2).length, color: '#FFBB28' },
          { name: '3 Stars', value: prospects.filter(p => p.interest_rating === 3).length, color: '#00C49F' },
          { name: '4 Stars', value: prospects.filter(p => p.interest_rating === 4).length, color: '#0088FE' },
          { name: '5 Stars', value: prospects.filter(p => p.interest_rating === 5).length, color: '#8884D8' },
        ]

        // Calculate sheets integration metrics
        const connectedProjects = projects.filter(p => sheetsData.some(s => s.projectId === p.id)).length
        const sheetsIntegrationData = [
          { name: 'Connected Projects', value: connectedProjects, color: '#00C49F' },
          { name: 'Unconnected Projects', value: projects.length - connectedProjects, color: '#FF8042' },
          { name: 'Total Sheets', value: sheetsData.length, color: '#0088FE' },
        ]

        // Calculate individual sheet metrics
        const sheetsMetrics = sheetsData.map(sheet => calculateSheetMetrics(sheet)).filter(Boolean)

        const metrics: EnhancedMetrics = {
          projectsTrend: { value: 12, direction: 'up' },
          completedTrend: { value: 8, direction: 'up' },
          prospectsTrend: { value: 15, direction: 'up' },
          hotProspectsTrend: { value: 20, direction: 'up' },
          projectStatusData,
          prospectInterestData,
          sheetsIntegrationData,
          sheetsMetrics
        }

        setEnhancedMetrics(metrics)
      } catch (error) {
        console.error('Error loading enhanced reports data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadEnhancedData()
  }, [projects, prospects])

  return {
    enhancedMetrics,
    isLoading: isLoading || sheetsLoading,
    sheetsData,
    prospectClients,
    refreshData: () => refreshSheetsData(mockProjectSheets),
    exportProspectClients
  }
}
