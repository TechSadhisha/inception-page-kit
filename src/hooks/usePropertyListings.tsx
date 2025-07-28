import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'
import { PropertyListing, PropertyInsert, PropertyUpdate } from '@/types/property'
import { useToast } from '@/hooks/use-toast'

export const usePropertyListings = (filters?: {
  city?: string
  property_type?: string
  listing_type?: string
  min_price?: number
  max_price?: number
  status?: string
}) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch property listings with filters
  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['property-listings', filters],
    queryFn: async () => {
      let query = supabase
        .from('property_listings')
        .select(`
          *,
          property_media(id, media_type, file_url, is_primary, display_order),
          property_features(id, feature_category, feature_name, feature_value)
        `)
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters?.city) {
        query = query.ilike('city', `%${filters.city}%`)
      }
      if (filters?.property_type) {
        query = query.eq('property_type', filters.property_type)
      }
      if (filters?.listing_type) {
        query = query.eq('listing_type', filters.listing_type)
      }
      if (filters?.min_price) {
        query = query.gte('price', filters.min_price)
      }
      if (filters?.max_price) {
        query = query.lte('price', filters.max_price)
      }
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      const { data, error } = await query

      if (error) throw error
      return data as PropertyListing[]
    },
    enabled: !!user,
  })

  // Create property listing
  const createPropertyMutation = useMutation({
    mutationFn: async (property: PropertyInsert) => {
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('property_listings')
        .insert([{ ...property, created_by: user.id }])
        .select()
        .single()

      if (error) throw error
      return data as PropertyListing
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-listings'] })
      toast({
        title: "Success",
        description: "Property listing created successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create property listing",
        variant: "destructive",
      })
      console.error('Error creating property:', error)
    },
  })

  // Update property listing
  const updatePropertyMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: PropertyUpdate }) => {
      const { data, error } = await supabase
        .from('property_listings')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as PropertyListing
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-listings'] })
      toast({
        title: "Success",
        description: "Property listing updated successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update property listing",
        variant: "destructive",
      })
      console.error('Error updating property:', error)
    },
  })

  // Delete property listing
  const deletePropertyMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('property_listings')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-listings'] })
      toast({
        title: "Success",
        description: "Property listing deleted successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete property listing",
        variant: "destructive",
      })
      console.error('Error deleting property:', error)
    },
  })

  // Sync properties from external sources
  const syncPropertiesMutation = useMutation({
    mutationFn: async (sourceId: string) => {
      const { data, error } = await supabase.functions.invoke('sync-properties', {
        body: { sourceId }
      })

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['property-listings'] })
      toast({
        title: "Sync Complete",
        description: `Synced ${data?.count || 0} properties successfully`,
      })
    },
    onError: (error) => {
      toast({
        title: "Sync Failed",
        description: "Failed to sync properties from external source",
        variant: "destructive",
      })
      console.error('Error syncing properties:', error)
    },
  })

  const createProperty = (property: PropertyInsert) => {
    createPropertyMutation.mutate(property)
  }

  const updateProperty = (id: string, updates: PropertyUpdate) => {
    updatePropertyMutation.mutate({ id, updates })
  }

  const deleteProperty = (id: string) => {
    deletePropertyMutation.mutate(id)
  }

  const syncProperties = (sourceId: string) => {
    syncPropertiesMutation.mutate(sourceId)
  }

  return {
    properties: properties || [],
    isLoading,
    error,
    createProperty,
    updateProperty,
    deleteProperty,
    syncProperties,
    isCreating: createPropertyMutation.isPending,
    isUpdating: updatePropertyMutation.isPending,
    isDeleting: deletePropertyMutation.isPending,
    isSyncing: syncPropertiesMutation.isPending,
  }
}