import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'
import { Prospect, ProspectInsert, ProspectUpdate } from '@/types/prospect'
import { useToast } from '@/hooks/use-toast'

export const useProspects = (projectId?: string) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch prospects for a specific project or all prospects
  const { data: prospects, isLoading, error } = useQuery({
    queryKey: ['prospects', projectId],
    queryFn: async () => {
      let query = supabase
        .from('prospects')
        .select('*')
        .order('created_at', { ascending: false })

      if (projectId) {
        query = query.eq('project_id', projectId)
      }

      const { data, error } = await query

      if (error) throw error
      
      // Transform the data to match our Prospect interface
      return (data || []).map(row => ({
        ...row,
        follow_ups: (row.follow_ups as any) || [],
        date_added: row.date_added || row.created_at,
      })) as Prospect[]
    },
    enabled: !!user,
  })

  // Create prospect mutation
  const createProspectMutation = useMutation({
    mutationFn: async (prospect: ProspectInsert) => {
      // Transform the prospect data for database insertion
      const dbProspect = {
        ...prospect,
        follow_ups: prospect.follow_ups ? JSON.stringify(prospect.follow_ups) : '[]'
      }
      
      const { data, error } = await supabase
        .from('prospects')
        .insert([dbProspect])
        .select()
        .single()

      if (error) throw error
      
      // Transform back to our interface
      return {
        ...data,
        follow_ups: data.follow_ups ? JSON.parse(data.follow_ups as string) : [],
        date_added: data.date_added || data.created_at,
      } as Prospect
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] })
      toast({
        title: "Success",
        description: "Prospect created successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create prospect",
        variant: "destructive",
      })
      console.error('Error creating prospect:', error)
    },
  })

  // Bulk create prospects mutation
  const createBulkProspectsMutation = useMutation({
    mutationFn: async (prospects: ProspectInsert[]) => {
      // Transform the prospects data for database insertion
      const dbProspects = prospects.map(prospect => ({
        ...prospect,
        follow_ups: prospect.follow_ups ? JSON.stringify(prospect.follow_ups) : '[]'
      }))
      
      const { data, error } = await supabase
        .from('prospects')
        .insert(dbProspects)
        .select()

      if (error) throw error
      
      // Transform back to our interface
      return (data || []).map(row => ({
        ...row,
        follow_ups: row.follow_ups ? JSON.parse(row.follow_ups as string) : [],
        date_added: row.date_added || row.created_at,
      })) as Prospect[]
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] })
      toast({
        title: "Success",
        description: `${data.length} prospects imported successfully`,
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to import prospects",
        variant: "destructive",
      })
      console.error('Error importing prospects:', error)
    },
  })

  // Update prospect mutation
  const updateProspectMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ProspectUpdate }) => {
      // Transform the updates data for database - handle follow_ups carefully
      const dbUpdates: any = { ...updates }
      
      // Only stringify follow_ups if it exists and is an array
      if (updates.follow_ups && Array.isArray(updates.follow_ups)) {
        dbUpdates.follow_ups = updates.follow_ups
      }
      
      const { data, error } = await supabase
        .from('prospects')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      // Transform back to our interface
      return {
        ...data,
        follow_ups: Array.isArray(data.follow_ups) ? data.follow_ups : 
                   typeof data.follow_ups === 'string' ? JSON.parse(data.follow_ups) : [],
        date_added: data.date_added || data.created_at,
      } as Prospect
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] })
      toast({
        title: "Success",
        description: "Prospect updated successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update prospect",
        variant: "destructive",
      })
      console.error('Error updating prospect:', error)
    },
  })

  // Delete prospect mutation
  const deleteProspectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('prospects')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] })
      toast({
        title: "Success",
        description: "Prospect deleted successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete prospect",
        variant: "destructive",
      })
      console.error('Error deleting prospect:', error)
    },
  })

  const createProspect = (prospect: ProspectInsert) => {
    createProspectMutation.mutate(prospect)
  }

  const createBulkProspects = (prospects: ProspectInsert[]) => {
    createBulkProspectsMutation.mutate(prospects)
  }

  const updateProspect = (id: string, updates: ProspectUpdate) => {
    updateProspectMutation.mutate({ id, updates })
  }

  const deleteProspect = (id: string) => {
    deleteProspectMutation.mutate(id)
  }

  return {
    prospects: prospects || [],
    isLoading,
    error,
    createProspect,
    createBulkProspects,
    updateProspect,
    deleteProspect,
    isCreating: createProspectMutation.isPending || createBulkProspectsMutation.isPending,
    isUpdating: updateProspectMutation.isPending,
    isDeleting: deleteProspectMutation.isPending,
  }
}
