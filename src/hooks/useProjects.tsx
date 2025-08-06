
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'
import { Project, ProjectInsert, ProjectUpdate } from '@/types/database'
import { useToast } from '@/hooks/use-toast'

export const useProjects = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch all projects for the current user
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      console.log('Fetching projects, user:', user?.id)
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      console.log('Projects fetch result:', { data, error })
      if (error) throw error
      return data as Project[]
    },
    enabled: !!user,
  })

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (project: Omit<ProjectInsert, 'created_by'>) => {
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...project, created_by: user.id }])
        .select()
        .maybeSingle()

      if (error) throw error
      return data as Project
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast({
        title: "Success",
        description: "Project created successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      })
      console.error('Error creating project:', error)
    },
  })

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ProjectUpdate }) => {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle()

      if (error) throw error
      return data as Project
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast({
        title: "Success",
        description: "Project updated successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      })
      console.error('Error updating project:', error)
    },
  })

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast({
        title: "Success",
        description: "Project deleted successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      })
      console.error('Error deleting project:', error)
    },
  })

  const createProject = (project: Omit<ProjectInsert, 'created_by'>) => {
    createProjectMutation.mutate(project)
  }

  const updateProject = (id: string, updates: ProjectUpdate) => {
    updateProjectMutation.mutate({ id, updates })
  }

  const deleteProject = (id: string) => {
    deleteProjectMutation.mutate(id)
  }

  return {
    projects: projects || [],
    isLoading,
    error,
    createProject,
    updateProject,
    deleteProject,
    isCreating: createProjectMutation.isPending,
    isUpdating: updateProjectMutation.isPending,
    isDeleting: deleteProjectMutation.isPending,
  }
}
