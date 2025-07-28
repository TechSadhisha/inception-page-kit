
import { useState, useEffect } from 'react'
import { useProjects } from './useProjects'
import { SheetData, ProspectClient } from '@/types/sheets'
import { fetchSheetData } from '@/utils/sheetsFetcher'
import { calculateSheetMetrics } from '@/utils/sheetsMetrics'
import { extractProspectClients, exportProspectClients } from '@/utils/prospectExtractor'

export const useGoogleSheetsData = () => {
  const { projects } = useProjects()
  const [sheetsData, setSheetsData] = useState<SheetData[]>([])
  const [prospectClients, setProspectClients] = useState<ProspectClient[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get all project sheets across all projects
  const [allProjectSheets, setAllProjectSheets] = useState<any[]>([])

  useEffect(() => {
    const fetchAllProjectSheets = async () => {
      const allSheets: any[] = []
      for (const project of projects) {
        // This would use the useProjectSheets hook for each project
        // For now, we'll simulate getting sheets for each project
        try {
          // In a real implementation, you'd fetch sheets for each project
          // const { projectSheets } = useProjectSheets(project.id)
          // allSheets.push(...projectSheets)
        } catch (err) {
          console.error(`Error fetching sheets for project ${project.id}:`, err)
        }
      }
      setAllProjectSheets(allSheets)
    }

    if (projects.length > 0) {
      fetchAllProjectSheets()
    }
  }, [projects])

  const refreshSheetsData = async (projectSheets: any[]) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const sheetsDataPromises = projectSheets.map(async (sheet) => {
        try {
          const sheetData = await fetchSheetData(sheet.sheet_id, sheet.sheet_url, sheet.sheet_name)
          return {
            sheetId: sheet.sheet_id,
            sheetName: sheet.sheet_name,
            projectId: sheet.project_id,
            ...sheetData
          }
        } catch (err) {
          console.error(`Failed to fetch sheet ${sheet.sheet_name}:`, err)
          return null
        }
      })

      const results = await Promise.all(sheetsDataPromises)
      const validResults = results.filter((result): result is SheetData => result !== null)
      
      setSheetsData(validResults)
      
      // Extract prospect clients from sheets marked as prospect sheets
      const prospects = extractProspectClients(validResults)
      setProspectClients(prospects)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sheets data')
    } finally {
      setIsLoading(false)
    }
  }

  const getSheetDataByProject = (projectId: string) => {
    return sheetsData.filter(sheet => sheet.projectId === projectId)
  }

  const getAllSheetsData = () => {
    return sheetsData
  }

  const getProspectSheets = () => {
    return sheetsData.filter(sheet => sheet.isProspectSheet)
  }

  const handleExportProspectClients = () => {
    exportProspectClients(prospectClients)
  }

  return {
    sheetsData,
    prospectClients,
    isLoading,
    error,
    refreshSheetsData,
    getSheetDataByProject,
    getAllSheetsData,
    getProspectSheets,
    calculateSheetMetrics,
    exportProspectClients: handleExportProspectClients
  }
}
