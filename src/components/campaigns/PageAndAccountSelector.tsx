import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useFacebookIntegration } from '@/hooks/useFacebookIntegration'
import { Loader2, Users, Building, RefreshCw } from 'lucide-react'

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

interface PageAndAccountSelectorProps {
  onSelectionComplete: (pageId: string, adAccountId: string) => void
  onRefreshRequested: () => void
  loading?: boolean
}

export const PageAndAccountSelector = ({ onSelectionComplete, onRefreshRequested, loading }: PageAndAccountSelectorProps) => {
  const { 
    integration, 
    isConnected, 
    hasValidToken,
    getPages,
    getAdAccountsForPage,
    updateSelectedPage,
    updateAdAccount
  } = useFacebookIntegration()
  
  const [pages, setPages] = useState<FacebookPage[]>([])
  const [adAccounts, setAdAccounts] = useState<FacebookAdAccount[]>([])
  const [selectedPageId, setSelectedPageId] = useState<string>(integration?.selected_page_id || '')
  const [selectedAdAccountId, setSelectedAdAccountId] = useState<string>(integration?.ad_account_id || '')
  const [loadingPages, setLoadingPages] = useState(false)
  const [loadingAdAccounts, setLoadingAdAccounts] = useState(false)

  const fetchPages = async () => {
    if (!isConnected || !hasValidToken) return
    
    setLoadingPages(true)
    try {
      const pagesList = await getPages()
      setPages(pagesList)
    } catch (error) {
      console.error('Error fetching pages:', error)
    } finally {
      setLoadingPages(false)
    }
  }

  const fetchAdAccountsForSelectedPage = async (pageId: string) => {
    if (!pageId) return
    
    setLoadingAdAccounts(true)
    try {
      const accounts = await getAdAccountsForPage(pageId)
      setAdAccounts(accounts)
    } catch (error) {
      console.error('Error fetching ad accounts:', error)
    } finally {
      setLoadingAdAccounts(false)
    }
  }

  const handlePageChange = async (pageId: string) => {
    setSelectedPageId(pageId)
    setSelectedAdAccountId('') // Reset ad account selection
    setAdAccounts([]) // Clear previous ad accounts
    
    const selectedPage = pages.find(page => page.id === pageId)
    if (selectedPage) {
      await updateSelectedPage(selectedPage.id, selectedPage.name, selectedPage.access_token)
      await fetchAdAccountsForSelectedPage(pageId)
    }
  }

  const handleAdAccountChange = async (adAccountId: string) => {
    setSelectedAdAccountId(adAccountId)
    
    const selectedAccount = adAccounts.find(account => account.id === adAccountId)
    if (selectedAccount) {
      await updateAdAccount(selectedAccount.id, selectedAccount.name)
      onSelectionComplete(selectedPageId, adAccountId)
    }
  }

  const handleRefresh = () => {
    if (selectedPageId && selectedAdAccountId) {
      onRefreshRequested()
    }
  }

  useEffect(() => {
    if (isConnected && hasValidToken) {
      fetchPages()
    }
  }, [isConnected, hasValidToken])

  useEffect(() => {
    // If we have stored selections, fetch ad accounts for the page
    if (selectedPageId && !adAccounts.length && pages.length > 0) {
      fetchAdAccountsForSelectedPage(selectedPageId)
    }
  }, [selectedPageId, pages])

  if (!isConnected) {
    return null // This component is only shown when connected
  }

  const hasCompleteSelection = selectedPageId && selectedAdAccountId
  const canRefresh = hasCompleteSelection && !loading

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Campaign Source Selection
        </CardTitle>
        <CardDescription>
          Select a Facebook Page and Ad Account to view campaigns and leads
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Page Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Facebook Page
          </label>
          <Select
            value={selectedPageId}
            onValueChange={handlePageChange}
            disabled={loadingPages || !pages.length}
          >
            <SelectTrigger>
              <SelectValue placeholder={loadingPages ? "Loading pages..." : "Select a Facebook page"} />
            </SelectTrigger>
            <SelectContent>
              {pages.map((page) => (
                <SelectItem key={page.id} value={page.id}>
                  {page.name} 
                  <Badge variant="outline" className="ml-2 text-xs">
                    {page.category}
                  </Badge>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {loadingPages && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Loading pages...
            </div>
          )}
        </div>

        {/* Ad Account Selection */}
        {selectedPageId && (
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Building className="h-4 w-4" />
              Ad Account
            </label>
            <Select
              value={selectedAdAccountId}
              onValueChange={handleAdAccountChange}
              disabled={loadingAdAccounts || !adAccounts.length}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingAdAccounts ? "Loading ad accounts..." : "Select an ad account"} />
              </SelectTrigger>
              <SelectContent>
                {adAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                    <Badge 
                      variant={account.account_status === 1 ? "secondary" : "destructive"} 
                      className="ml-2 text-xs"
                    >
                      {account.account_status === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {loadingAdAccounts && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading ad accounts...
              </div>
            )}
            {selectedPageId && adAccounts.length === 0 && !loadingAdAccounts && (
              <Alert>
                <AlertDescription>
                  No ad accounts found for this page. Make sure the page has associated ad accounts with proper permissions.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Refresh Button */}
        {hasCompleteSelection && (
          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={!canRefresh}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh Campaign Data
            </Button>
          </div>
        )}

        {/* Status Display */}
        {hasCompleteSelection && (
          <div className="text-sm text-muted-foreground border-t pt-2">
            <p>Selected: {pages.find(p => p.id === selectedPageId)?.name} → {adAccounts.find(a => a.id === selectedAdAccountId)?.name}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}