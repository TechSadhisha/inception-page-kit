
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'

interface SiteMedia {
  id: string
  project_id: string
  file_name: string
  file_path: string
  media_type: string
  description: string | null
  location_lat: number | null
  location_lng: number | null
  uploaded_by: string
  created_at: string
}

export const useSiteMedia = (projectId?: string) => {
  const { user } = useAuth()

  const { data: siteMedia, isLoading, error, refetch } = useQuery({
    queryKey: ['site-media', projectId],
    queryFn: async () => {
      let query = supabase
        .from('site_media')
        .select('*')
        .order('created_at', { ascending: false })

      if (projectId) {
        query = query.eq('project_id', projectId)
      }

      const { data, error } = await query

      if (error) throw error
      return data as SiteMedia[]
    },
    enabled: !!user,
  })

  return {
    siteMedia: siteMedia || [],
    isLoading,
    error,
    refetch,
  }
}
