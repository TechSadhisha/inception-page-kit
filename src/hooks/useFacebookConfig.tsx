import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface FacebookConfig {
  appId: string
  redirectUri: string
}

export const useFacebookConfig = () => {
  const [config, setConfig] = useState<FacebookConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase.functions.invoke('get-facebook-config')
        
        if (error) throw error
        
        setConfig(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching Facebook config:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch Facebook config')
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, [])

  return { config, loading, error }
}