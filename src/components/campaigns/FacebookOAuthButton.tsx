import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'
import { useFacebookConfig } from '@/hooks/useFacebookConfig'
import { Facebook } from 'lucide-react'

interface FacebookOAuthButtonProps {
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
}

export const FacebookOAuthButton = ({ onSuccess, onError }: FacebookOAuthButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const { config: facebookConfig, loading: configLoading } = useFacebookConfig()

  const handleFacebookLogin = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to connect your Facebook account.",
        variant: "destructive"
      })
      return
    }

    if (!facebookConfig) {
      toast({
        title: "Configuration Error",
        description: "Facebook configuration not loaded. Please try again.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    // Facebook OAuth URL with required permissions
    const redirectUri = encodeURIComponent(facebookConfig.redirectUri)
    const scope = encodeURIComponent('ads_management,ads_read,business_management,pages_show_list,email,public_profile')
    const state = user.id // Pass user ID as state parameter
    
    const facebookOAuthUrl = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${facebookConfig.appId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&response_type=code`

    // Open popup window for Facebook OAuth
    const popup = window.open(
      facebookOAuthUrl,
      'facebook-oauth',
      'width=600,height=600,scrollbars=yes,resizable=yes'
    )

    // Listen for messages from the popup
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://qnmbwccznpikmkrzjoin.supabase.co') {
        return
      }

      if (event.data.type === 'FACEBOOK_AUTH_SUCCESS') {
        console.log('Facebook OAuth success:', event.data.data)
        toast({
          title: "Facebook Connected!",
          description: "Your Facebook account has been connected successfully.",
        })
        onSuccess?.(event.data.data)
        setIsLoading(false)
        popup?.close()
      } else if (event.data.type === 'FACEBOOK_AUTH_ERROR') {
        console.error('Facebook OAuth error:', event.data.error)
        toast({
          title: "Connection Failed",
          description: event.data.error || "Failed to connect to Facebook.",
          variant: "destructive"
        })
        onError?.(event.data.error)
        setIsLoading(false)
        popup?.close()
      }

      window.removeEventListener('message', handleMessage)
    }

    window.addEventListener('message', handleMessage)

    // Handle popup blocked or closed
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        setIsLoading(false)
        clearInterval(checkClosed)
        window.removeEventListener('message', handleMessage)
      }
    }, 1000)
  }

  return (
    <Button
      onClick={handleFacebookLogin}
      disabled={isLoading || configLoading || !facebookConfig}
      className="w-full"
      size="lg"
    >
      <Facebook className="mr-2 h-5 w-5" />
      {configLoading ? 'Loading...' : isLoading ? 'Connecting...' : 'Connect with Facebook'}
    </Button>
  )
}