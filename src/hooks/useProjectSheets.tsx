
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'
import { useToast } from '@/hooks/use-toast'

interface ProjectSheet {
  id: string
  project_id: string
  sheet_id: string
  sheet_name: string
  sheet_url: string
  user_id: string
  created_at: string
}

interface ProjectSheetInsert {
  project_id: string
  sheet_id: string
  sheet_name: string
  sheet_url: string
}

export const useProjectSheets = (projectId: string) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch project sheets
  const { data: projectSheets, isLoading, error } = useQuery({
    queryKey: ['project-sheets', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_sheets')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as ProjectSheet[]
    },
    enabled: !!user && !!projectId,
  })

  // Create project sheet mutation
  const createProjectSheetMutation = useMutation({
    mutationFn: async (sheet: ProjectSheetInsert) => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('project_sheets')
        .insert([{
          ...sheet,
          user_id: user.id
        }])
        .select()
        .maybeSingle()

      if (error) throw error
      return data as ProjectSheet
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-sheets'] })
      toast({
        title: "Success",
        description: "Sheet added successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add sheet",
        variant: "destructive",
      })
      console.error('Error creating project sheet:', error)
    },
  })

  // Delete project sheet mutation
  const deleteProjectSheetMutation = useMutation({
    mutationFn: async (sheetId: string) => {
      const { error } = await supabase
        .from('project_sheets')
        .delete()
        .eq('id', sheetId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-sheets'] })
      toast({
        title: "Success",
        description: "Sheet removed successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove sheet",
        variant: "destructive",
      })
      console.error('Error deleting project sheet:', error)
    },
  })

  const createProjectSheet = (sheet: ProjectSheetInsert) => {
    createProjectSheetMutation.mutate(sheet)
  }

  const deleteProjectSheet = (sheetId: string) => {
    deleteProjectSheetMutation.mutate(sheetId)
  }

  return {
    projectSheets: projectSheets || [],
    isLoading,
    error,
    createProjectSheet,
    deleteProjectSheet,
    isCreating: createProjectSheetMutation.isPending,
    isDeleting: deleteProjectSheetMutation.isPending,
  }
}
