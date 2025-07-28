
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { createMetaAdsService } from '@/services/metaAdsService'
import { MetaCredentialsForm } from './MetaCredentialsForm'
import { ConnectionTest } from './ConnectionTest'
import { MetaHelpSection } from './MetaHelpSection'

export const CampaignSettings = () => {
  const { toast } = useToast()
  const { user } = useAuth()
  const [settings, setSettings] = useState({
    metaAppId: '',
    metaAppSecret: '',
    adAccountId: '',
    accessToken: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSettings, setIsLoadingSettings] = useState(true)
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'success' | 'error' | null>(null)

  useEffect(() => {
    if (user) {
      loadSettings()
    }
  }, [user])

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('campaign_settings')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle()

      if (error) throw error

      if (data) {
        setSettings({
          metaAppId: data.meta_app_id || '',
          metaAppSecret: data.meta_app_secret || '',
          adAccountId: data.ad_account_id || '',
          accessToken: data.access_token || ''
        })
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      })
    } finally {
      setIsLoadingSettings(false)
    }
  }

  const testConnection = async () => {
    if (!settings.accessToken || !settings.adAccountId) {
      toast({
        title: "Error",
        description: "Please fill in Access Token and Ad Account ID to test connection",
        variant: "destructive",
      })
      return
    }

    setIsTestingConnection(true)
    try {
      const metaService = await createMetaAdsService()
      if (!metaService) {
        throw new Error('Failed to create Meta service')
      }

      const isConnected = await metaService.testConnection()
      setConnectionStatus(isConnected ? 'success' : 'error')
      
      toast({
        title: isConnected ? "Connection Successful" : "Connection Failed",
        description: isConnected 
          ? "Successfully connected to Meta Ads API" 
          : "Failed to connect to Meta Ads API. Please check your credentials.",
        variant: isConnected ? "default" : "destructive",
      })
    } catch (error) {
      setConnectionStatus('error')
      toast({
        title: "Connection Failed",
        description: "Failed to test connection to Meta Ads API",
        variant: "destructive",
      })
    } finally {
      setIsTestingConnection(false)
    }
  }

  const handleSave = async () => {
    if (!settings.metaAppId || !settings.metaAppSecret || !settings.adAccountId || !settings.accessToken) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('campaign_settings')
        .upsert({
          user_id: user?.id,
          meta_app_id: settings.metaAppId,
          meta_app_secret: settings.metaAppSecret,
          ad_account_id: settings.adAccountId,
          access_token: settings.accessToken
        })

      if (error) throw error
      
      toast({
        title: "Success",
        description: "Meta Business settings saved successfully",
      })
      
      // Reset connection status after saving
      setConnectionStatus(null)
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meta Business Integration</CardTitle>
        <CardDescription>
          Configure your Meta Business account settings to publish ads directly to Facebook and Instagram
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <MetaCredentialsForm 
          settings={settings}
          onSettingsChange={setSettings}
        />
        
        <div className="flex items-center space-x-2 pt-2">
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
          
          <ConnectionTest
            isTestingConnection={isTestingConnection}
            connectionStatus={connectionStatus}
            onTestConnection={testConnection}
          />
        </div>
        
        <MetaHelpSection />
      </CardContent>
    </Card>
  )
}
