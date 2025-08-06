
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'

export interface Script {
  id: string
  project_id: string
  created_by: string
  title: string
  content: string
  type: 'presentation' | 'video' | 'audio' | 'document'
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ScriptInsert {
  project_id: string
  title: string
  content: string
  type: 'presentation' | 'video' | 'audio' | 'document'
  notes?: string
}

export const useScripts = (projectId?: string) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: scripts = [], isLoading, error } = useQuery({
    queryKey: ['scripts', projectId],
    queryFn: async () => {
      let query = supabase
        .from('scripts')
        .select('*')
        .order('updated_at', { ascending: false })

      if (projectId) {
        query = query.eq('project_id', projectId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching scripts:', error)
        throw error
      }

      return data as Script[]
    },
    enabled: !!user,
  })

  const createScript = useMutation({
    mutationFn: async (script: ScriptInsert) => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('scripts')
        .insert({
          ...script,
          created_by: user.id,
        })
        .select()
        .maybeSingle()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scripts'] })
      toast({
        title: "Script saved",
        description: "Your script has been saved successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error saving script",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const updateScript = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ScriptInsert> }) => {
      const { data, error } = await supabase
        .from('scripts')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .maybeSingle()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scripts'] })
      toast({
        title: "Script updated",
        description: "Your script has been updated successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error updating script",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const deleteScript = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('scripts')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scripts'] })
      toast({
        title: "Script deleted",
        description: "Your script has been deleted successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error deleting script",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  return {
    scripts,
    isLoading,
    error,
    createScript: createScript.mutate,
    updateScript: updateScript.mutate,
    deleteScript: deleteScript.mutate,
    isCreating: createScript.isPending,
    isUpdating: updateScript.isPending,
    isDeleting: deleteScript.isPending,
  }
}
