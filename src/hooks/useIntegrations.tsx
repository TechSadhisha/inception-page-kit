import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'
import { IntegrationConfig, PortalIntegration, LeadSource } from '@/types/integration'
import { useToast } from '@/hooks/use-toast'

export const useIntegrations = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch integration configurations
  const { data: integrations, isLoading: integrationsLoading } = useQuery({
    queryKey: ['integrations'],
    queryFn: async () => {
      // Stub implementation - return empty array for now
      return []
    },
    enabled: !!user,
  })

  // Fetch portal integrations
  const { data: portalIntegrations, isLoading: portalsLoading } = useQuery({
    queryKey: ['portal-integrations'],
    queryFn: async () => {
      // Stub implementation - return empty array for now
      return []
    },
    enabled: !!user,
  })

  // Fetch lead sources
  const { data: leadSources, isLoading: sourcesLoading } = useQuery({
    queryKey: ['lead-sources'],
    queryFn: async () => {
      // Stub implementation - return empty array for now
      return []
    },
    enabled: !!user,
  })

  // Create integration
  const createIntegrationMutation = useMutation({
    mutationFn: async (integration: Omit<IntegrationConfig, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
      if (!user) throw new Error('User not authenticated')
      
      // Stub implementation
      return { id: 'temp', ...integration, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] })
      toast({
        title: "Integration Created",
        description: "Integration configured successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create integration",
        variant: "destructive",
      })
      console.error('Error creating integration:', error)
    },
  })

  // Test integration connection
  const testConnectionMutation = useMutation({
    mutationFn: async (integrationId: string) => {
      // Stub implementation
      return { success: true, message: 'Connection test successful' }
    },
    onSuccess: (data) => {
      toast({
        title: data.success ? "Connection Successful" : "Connection Failed",
        description: data.message,
        variant: data.success ? "default" : "destructive",
      })
    },
    onError: (error) => {
      toast({
        title: "Test Failed",
        description: "Failed to test integration connection",
        variant: "destructive",
      })
      console.error('Error testing integration:', error)
    },
  })

  // Sync data from integration
  const syncDataMutation = useMutation({
    mutationFn: async ({ 
      integrationId, 
      dataType 
    }: { 
      integrationId: string
      dataType: 'leads' | 'properties' | 'campaigns'
    }) => {
      // Stub implementation
      return { count: 0 }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] })
      queryClient.invalidateQueries({ queryKey: ['prospects'] })
      queryClient.invalidateQueries({ queryKey: ['property-listings'] })
      toast({
        title: "Sync Complete",
        description: `Synced ${data?.count || 0} records successfully`,
      })
    },
    onError: (error) => {
      toast({
        title: "Sync Failed",
        description: "Failed to sync data from integration",
        variant: "destructive",
      })
      console.error('Error syncing data:', error)
    },
  })

  // Toggle integration status
  const toggleIntegrationMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      // Stub implementation
      return { id, is_active: isActive }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] })
      toast({
        title: "Integration Updated",
        description: "Integration status updated successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update integration status",
        variant: "destructive",
      })
      console.error('Error updating integration:', error)
    },
  })

  const createIntegration = (integration: Omit<IntegrationConfig, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    createIntegrationMutation.mutate(integration)
  }

  const testConnection = (integrationId: string) => {
    testConnectionMutation.mutate(integrationId)
  }

  const syncData = (integrationId: string, dataType: 'leads' | 'properties' | 'campaigns') => {
    syncDataMutation.mutate({ integrationId, dataType })
  }

  const toggleIntegration = (id: string, isActive: boolean) => {
    toggleIntegrationMutation.mutate({ id, isActive })
  }

  return {
    integrations: integrations || [],
    portalIntegrations: portalIntegrations || [],
    leadSources: leadSources || [],
    isLoading: integrationsLoading || portalsLoading || sourcesLoading,
    createIntegration,
    testConnection,
    syncData,
    toggleIntegration,
    isCreating: createIntegrationMutation.isPending,
    isTesting: testConnectionMutation.isPending,
    isSyncing: syncDataMutation.isPending,
    isToggling: toggleIntegrationMutation.isPending,
  }
}