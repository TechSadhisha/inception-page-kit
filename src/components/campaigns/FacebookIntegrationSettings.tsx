import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FacebookOAuthButton } from './FacebookOAuthButton'
import { useFacebookIntegration } from '@/hooks/useFacebookIntegration'
import { CheckCircle, XCircle, Loader2, AlertCircle, Users, Building } from 'lucide-react'

interface FacebookAdAccount {
  id: string
  name: string
  account_status: number
}

export const FacebookIntegrationSettings = () => {
  const { 
    integration, 
    loading, 
    connecting,
    isConnected, 
    hasValidToken,
    disconnect, 
    testConnection,
    getAdAccounts,
    updateAdAccount,
    refreshIntegration 
  } = useFacebookIntegration()
  
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'success' | 'failed'>('unknown')
  const [adAccounts, setAdAccounts] = useState<FacebookAdAccount[]>([])
  const [loadingAdAccounts, setLoadingAdAccounts] = useState(false)

  const handleConnectionSuccess = (data: any) => {
    refreshIntegration()
    if (data.adAccounts?.length > 0) {
      setAdAccounts(data.adAccounts)
    }
  }

  const handleTestConnection = async () => {
    setIsTestingConnection(true)
    try {
      const result = await testConnection()
      setConnectionStatus(result ? 'success' : 'failed')
      
      if (result) {
        // Also load ad accounts when connection test succeeds
        setLoadingAdAccounts(true)
        const accounts = await getAdAccounts()
        setAdAccounts(accounts)
        setLoadingAdAccounts(false)
      }
    } catch (error) {
      setConnectionStatus('failed')
    } finally {
      setIsTestingConnection(false)
    }
  }

  const handleAdAccountChange = (value: string) => {
    const selectedAccount = adAccounts.find(account => account.id === value)
    if (selectedAccount) {
      updateAdAccount(selectedAccount.id, selectedAccount.name)
    }
  }

  useEffect(() => {
    if (isConnected && hasValidToken) {
      handleTestConnection()
    }
  }, [isConnected, hasValidToken])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Facebook Business Integration
          </CardTitle>
          <CardDescription>
            Loading integration status...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Facebook Business Integration
          </CardTitle>
          <CardDescription>
            Connect your Facebook account to manage ad campaigns directly from the CRM
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You'll need a Facebook Business account with active ad accounts to use this feature.
              The integration requires permissions to manage ads and access business data.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <h4 className="font-medium">Required Permissions:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• ads_management - Create and manage ad campaigns</li>
              <li>• ads_read - Read campaign performance data</li>
              <li>• business_management - Access business accounts</li>
              <li>• pages_show_list - Access page information</li>
            </ul>
          </div>

          <FacebookOAuthButton 
            onSuccess={handleConnectionSuccess}
            onError={(error) => console.error('OAuth error:', error)}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Facebook Business Integration
          <Badge variant="secondary" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Connected
          </Badge>
        </CardTitle>
        <CardDescription>
          Your Facebook account is connected and ready to manage campaigns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connection Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Connection Status</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestConnection}
              disabled={isTestingConnection}
            >
              {isTestingConnection ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Test Connection
            </Button>
          </div>
          
          {connectionStatus !== 'unknown' && (
            <Alert variant={connectionStatus === 'success' ? 'default' : 'destructive'}>
              {connectionStatus === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                {connectionStatus === 'success' 
                  ? 'Facebook API connection is working properly'
                  : 'Failed to connect to Facebook API. Please check your permissions or reconnect.'
                }
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Integration Details */}
        <div className="space-y-3">
          <h4 className="font-medium">Integration Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Facebook User ID:</span>
              <p className="text-muted-foreground">{integration?.facebook_user_id}</p>
            </div>
            <div>
              <span className="font-medium">Connected:</span>
              <p className="text-muted-foreground">
                {integration?.created_at ? new Date(integration.created_at).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>
        </div>

        {/* Ad Account Selection */}
        {adAccounts.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Ad Account Selection
            </h4>
            <Select
              value={integration?.ad_account_id || ''}
              onValueChange={handleAdAccountChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an ad account" />
              </SelectTrigger>
              <SelectContent>
                {adAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} ({account.id})
                    {account.account_status === 1 ? (
                      <Badge variant="secondary" className="ml-2">Active</Badge>
                    ) : (
                      <Badge variant="destructive" className="ml-2">Inactive</Badge>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {integration?.ad_account_name && (
              <p className="text-sm text-muted-foreground">
                Currently using: {integration.ad_account_name}
              </p>
            )}
          </div>
        )}

        {loadingAdAccounts && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading ad accounts...
          </div>
        )}

        {/* Disconnect Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button
            variant="destructive"
            onClick={disconnect}
            disabled={connecting}
          >
            {connecting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Disconnect Facebook
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}