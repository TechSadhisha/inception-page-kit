import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'

interface FacebookIntegration {
  id: string
  facebook_user_id: string
  access_token: string
  token_expires_at: string | null
  ad_account_id: string | null
  ad_account_name: string | null
  business_id: string | null
  permissions: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

interface FacebookUser {
  id: string
  name: string
  email?: string
}

interface FacebookAdAccount {
  id: string
  name: string
  account_status: number
}

interface FacebookPage {
  id: string
  name: string
  access_token: string
  category: string
}

export const useFacebookIntegration = () => {
  const [integration, setIntegration] = useState<FacebookIntegration | null>(null)
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const loadIntegration = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('facebook_integrations')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading Facebook integration:', error)
        throw error
      }

      setIntegration(data)
    } catch (error) {
      console.error('Error loading Facebook integration:', error)
      toast({
        title: "Error",
        description: "Failed to load Facebook integration status",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const disconnect = async () => {
    if (!user || !integration) return

    setConnecting(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No active session')
      }

      const response = await supabase.functions.invoke('facebook-disconnect', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

      if (response.error) {
        throw response.error
      }

      setIntegration(null)
      toast({
        title: "Disconnected",
        description: "Facebook integration has been disconnected successfully"
      })
    } catch (error) {
      console.error('Error disconnecting Facebook:', error)
      toast({
        title: "Error",
        description: "Failed to disconnect Facebook integration",
        variant: "destructive"
      })
    } finally {
      setConnecting(false)
    }
  }

  const testConnection = async (): Promise<boolean> => {
    if (!integration?.access_token) {
      return false
    }

    try {
      const response = await fetch(`https://graph.facebook.com/v20.0/me?access_token=${integration.access_token}`)
      return response.ok
    } catch (error) {
      console.error('Connection test failed:', error)
      return false
    }
  }

  const getAdAccounts = async (): Promise<FacebookAdAccount[]> => {
    if (!integration?.access_token) {
      return []
    }

    try {
      const response = await fetch(`https://graph.facebook.com/v20.0/me/adaccounts?fields=id,name,account_status&access_token=${integration.access_token}`)
      if (!response.ok) {
        throw new Error('Failed to fetch ad accounts')
      }

      const data = await response.json()
      return data.data || []
    } catch (error) {
      console.error('Error fetching ad accounts:', error)
      return []
    }
  }

  const getPages = async (): Promise<FacebookPage[]> => {
    if (!integration?.access_token) {
      return []
    }

    try {
      const response = await fetch(`https://graph.facebook.com/v20.0/me/accounts?fields=id,name,access_token,category&access_token=${integration.access_token}`)
      if (!response.ok) {
        throw new Error('Failed to fetch pages')
      }

      const data = await response.json()
      return data.data || []
    } catch (error) {
      console.error('Error fetching pages:', error)
      return []
    }
  }

  const updateAdAccount = async (adAccountId: string, adAccountName: string) => {
    if (!user || !integration) return

    try {
      const { error } = await supabase
        .from('facebook_integrations')
        .update({
          ad_account_id: adAccountId,
          ad_account_name: adAccountName
        })
        .eq('id', integration.id)

      if (error) throw error

      setIntegration(prev => prev ? {
        ...prev,
        ad_account_id: adAccountId,
        ad_account_name: adAccountName
      } : null)

      toast({
        title: "Ad Account Updated",
        description: `Selected ad account: ${adAccountName}`
      })
    } catch (error) {
      console.error('Error updating ad account:', error)
      toast({
        title: "Error",
        description: "Failed to update ad account selection",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    loadIntegration()
  }, [user])

  return {
    integration,
    loading,
    connecting,
    isConnected: !!integration?.is_active,
    hasValidToken: !!integration?.access_token,
    disconnect,
    testConnection,
    getAdAccounts,
    getPages,
    updateAdAccount,
    refreshIntegration: loadIntegration
  }
}