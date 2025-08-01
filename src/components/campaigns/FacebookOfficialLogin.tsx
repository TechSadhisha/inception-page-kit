import { useEffect, useRef } from 'react'
import { useToast } from '@/hooks/use-toast'

interface FacebookOfficialLoginProps {
  onLoginSuccess?: (response: any) => void
  onLoginError?: (error: string) => void
}

export const FacebookOfficialLogin = ({ onLoginSuccess, onLoginError }: FacebookOfficialLoginProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Define global callback functions for XFBML
    ;(window as any).checkLoginState = function() {
      if (!(window as any).FB) {
        console.error('Facebook SDK not loaded')
        return
      }
      
      ;(window as any).FB.getLoginStatus(function(response: any) {
        ;(window as any).statusChangeCallback(response)
      })
    }

    ;(window as any).statusChangeCallback = function(response: any) {
      console.log('Facebook login status:', response)
      
      if (response.status === 'connected') {
        // User logged in with Facebook and authorized your app
        const { accessToken, userID } = response.authResponse
        console.log('Facebook login successful! User ID:', userID)
        console.log('Access Token:', accessToken)
        
        toast({
          title: "Facebook Login Successful!",
          description: `Connected as User ID: ${userID}`,
        })
        
        onLoginSuccess?.(response)
      } else if (response.status === 'not_authorized') {
        // User is logged into Facebook but not your app
        const errorMsg = "Please authorize our app to continue."
        console.log(errorMsg)
        
        toast({
          title: "Authorization Required",
          description: errorMsg,
          variant: "destructive"
        })
        
        onLoginError?.(errorMsg)
      } else {
        // User not logged into Facebook
        const errorMsg = "Please log into Facebook first."
        console.log(errorMsg)
        
        toast({
          title: "Facebook Login Required",
          description: errorMsg,
          variant: "destructive"
        })
        
        onLoginError?.(errorMsg)
      }
    }

    // Parse XFBML when component mounts
    const parseXFBML = () => {
      const FB = (window as any).FB
      if (FB && FB.XFBML) {
        FB.XFBML.parse(containerRef.current || undefined)
      }
    }

    // Check if FB is already loaded
    if ((window as any).FB) {
      parseXFBML()
    } else {
      // Wait for FB to load
      const checkFB = setInterval(() => {
        if ((window as any).FB) {
          parseXFBML()
          clearInterval(checkFB)
        }
      }, 100)
      
      return () => clearInterval(checkFB)
    }

    // Cleanup global functions on unmount
    return () => {
      const win = window as any
      if (win.checkLoginState) {
        delete win.checkLoginState
      }
      if (win.statusChangeCallback) {
        delete win.statusChangeCallback
      }
    }
  }, [onLoginSuccess, onLoginError, toast])

  return (
    <div ref={containerRef} className="space-y-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Connect with Facebook
        </h3>
        <p className="text-sm text-blue-700 mb-4">
          Login with your Facebook account to manage ad campaigns and access your business data.
        </p>
        
        {/* Official Facebook Login Button using XFBML */}
        <div 
          className="fb-login-button" 
          data-width=""
          data-size="large"
          data-button-type="login_with"
          data-layout="default"
          data-auto-logout-link="false"
          data-use-continue-as="false"
          data-scope="public_profile,email,ads_management,ads_read,business_management,pages_show_list,leads_retrieval"
          data-onlogin="checkLoginState();"
        ></div>
      </div>
      
      <div className="text-xs text-muted-foreground">
        <p>Required permissions: ads_management, ads_read, business_management, pages_show_list, leads_retrieval</p>
      </div>
    </div>
  )
}