import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Facebook } from 'lucide-react'

interface FacebookAuthResponse {
  accessToken: string
  expiresIn: string
  signedRequest: string
  userID: string
}

interface FacebookLoginResponse {
  status: 'connected' | 'not_authorized' | 'unknown'
  authResponse?: FacebookAuthResponse
}

interface FacebookSDKLoginProps {
  onLoginSuccess?: (response: FacebookLoginResponse) => void
  onLoginError?: (error: string) => void
}

declare global {
  interface Window {
    FB: {
      init: (params: any) => void
      getLoginStatus: (callback: (response: FacebookLoginResponse) => void) => void
      login: (callback: (response: FacebookLoginResponse) => void, options?: { scope: string }) => void
      logout: (callback?: () => void) => void
    }
    fbAsyncInit: () => void
  }
}

export const FacebookSDKLogin = ({ onLoginSuccess, onLoginError }: FacebookSDKLoginProps) => {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)
  const [loginStatus, setLoginStatus] = useState<'unknown' | 'connected' | 'not_authorized'>('unknown')
  const [isLoading, setIsLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<FacebookAuthResponse | null>(null)
  const { toast } = useToast()

  // Initialize Facebook SDK when it loads
  useEffect(() => {
    // Check if SDK is already loaded
    if (window.FB) {
      setIsSDKLoaded(true)
      checkLoginStatus()
      return
    }

    // Set up the async init function
    window.fbAsyncInit = function() {
      console.log('Facebook SDK initializing...')
      window.FB.init({
        appId: '1994898331253424',
        cookie: true,
        xfbml: false,
        version: 'v20.0'
      })

      setIsSDKLoaded(true)
      
      // Check login status after SDK initialization
      window.FB.getLoginStatus(function(response) {
        statusChangeCallback(response)
      })
    }

    // Wait for SDK to load if not already loaded
    const checkSDK = setInterval(() => {
      if (window.FB) {
        clearInterval(checkSDK)
      }
    }, 100)

    return () => clearInterval(checkSDK)
  }, [])

  const statusChangeCallback = (response: FacebookLoginResponse) => {
    console.log('Facebook login status:', response)
    setLoginStatus(response.status)
    
    if (response.status === 'connected') {
      // User logged into Facebook and your app
      const auth = response.authResponse
      if (auth) {
        console.log('Access Token:', auth.accessToken)
        console.log('User ID:', auth.userID)
        setUserInfo(auth)
        
        toast({
          title: "Facebook Connected",
          description: "Successfully connected to Facebook!",
        })
        
        onLoginSuccess?.(response)
      }
    } else if (response.status === 'not_authorized') {
      // User logged into Facebook but not authorized your app
      console.log('User logged into Facebook but not authorized app')
      setUserInfo(null)
    } else {
      // User not logged into Facebook
      console.log('User not logged into Facebook')
      setUserInfo(null)
    }
  }

  const checkLoginStatus = () => {
    if (!window.FB) return
    
    console.log('Checking Facebook login status...')
    window.FB.getLoginStatus(function(response) {
      statusChangeCallback(response)
    })
  }

  const handleFacebookLogin = () => {
    if (!isSDKLoaded || !window.FB) {
      toast({
        title: "SDK Not Loaded",
        description: "Facebook SDK is not loaded yet. Please try again.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    
    console.log('Initiating Facebook login...')
    window.FB.login(function(response) {
      setIsLoading(false)
      
      if (response.status === 'connected') {
        statusChangeCallback(response)
      } else {
        console.error('Facebook login failed:', response)
        const errorMsg = 'Facebook login was cancelled or failed'
        toast({
          title: "Login Failed",
          description: errorMsg,
          variant: "destructive"
        })
        onLoginError?.(errorMsg)
      }
    }, {
      scope: 'email,public_profile,ads_management,ads_read,business_management,pages_show_list'
    })
  }

  const handleFacebookLogout = () => {
    if (!window.FB) return
    
    setIsLoading(true)
    window.FB.logout(() => {
      setIsLoading(false)
      setLoginStatus('unknown')
      setUserInfo(null)
      
      toast({
        title: "Logged Out",
        description: "Successfully logged out of Facebook",
      })
      
      console.log('User logged out of Facebook')
    })
  }

  if (!isSDKLoaded) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">Loading Facebook SDK...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {loginStatus === 'connected' && userInfo ? (
        <div className="space-y-3">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Facebook className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Connected to Facebook
              </span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              User ID: {userInfo.userID}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={checkLoginStatus}
              variant="outline"
              size="sm"
            >
              Refresh Status
            </Button>
            <Button
              onClick={handleFacebookLogout}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              {isLoading ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              Connect your Facebook account to manage ad campaigns
            </p>
          </div>
          
          <Button
            onClick={handleFacebookLogin}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            <Facebook className="mr-2 h-5 w-5" />
            {isLoading ? 'Connecting...' : 'Login with Facebook'}
          </Button>
          
          <Button
            onClick={checkLoginStatus}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Check Login Status
          </Button>
        </div>
      )}
      
      <div className="text-xs text-muted-foreground">
        Status: {loginStatus} | SDK: {isSDKLoaded ? 'Loaded' : 'Loading'}
      </div>
    </div>
  )
}