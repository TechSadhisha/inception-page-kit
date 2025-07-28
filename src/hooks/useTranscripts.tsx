
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'

interface Transcript {
  id: string
  prospect_id: string
  file_name: string
  file_path: string
  transcript_text: string | null
  uploaded_by: string
  created_at: string
}

export const useTranscripts = (prospectId?: string) => {
  const { user } = useAuth()

  const { data: transcripts, isLoading, error, refetch } = useQuery({
    queryKey: ['transcripts', prospectId],
    queryFn: async () => {
      let query = supabase
        .from('transcripts')
        .select('*')
        .order('created_at', { ascending: false })

      if (prospectId) {
        query = query.eq('prospect_id', prospectId)
      }

      const { data, error } = await query

      if (error) throw error
      return data as Transcript[]
    },
    enabled: !!user,
  })

  return {
    transcripts: transcripts || [],
    isLoading,
    error,
    refetch,
  }
}
