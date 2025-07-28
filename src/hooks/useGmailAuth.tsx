import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';

const GIS_SCRIPT_URL = 'https://accounts.google.com/gsi/client';
const GMAIL_SCOPE = 'https://www.googleapis.com/auth/gmail.readonly openid email profile';


interface GmailAuthHook {
  isAuthenticated: boolean;
  accessToken: string | null;
  currentAccount: string | null;
  connectedAccounts: string[];
  signInWithGoogle: (clientId: string) => void;
  signOut: (email?: string) => void;
  switchAccount: (email: string) => void;
  isLoading: boolean;
}

declare global {
  interface Window {
    google?: any;
  }
}

export const useGmailAuth = (clientId: string): GmailAuthHook => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [connectedAccounts, setConnectedAccounts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [gisInitialized, setGisInitialized] = useState(false);
  const { toast } = useToast();

  // Reference to Google Token Client
  const [tokenClient, setTokenClient] = useState<any>(null);

  // Load GIS script dynamically
  useEffect(() => {
    if (window.google) {
      setGisInitialized(true);
      return;
    }

    const script = document.createElement('script');
    script.src = GIS_SCRIPT_URL;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setGisInitialized(true);
      console.log('Google Identity Services script loaded.');
    };

    script.onerror = () => {
      toast({
        title: 'Google API Error',
        description: 'Failed to load Google Identity Services script. Please refresh the page.',
        variant: 'destructive',
      });
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [toast]);

  // Initialize Token Client once GIS script and clientId are ready
  useEffect(() => {
    if (!gisInitialized || !clientId || tokenClient) return;

    const newTokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: GMAIL_SCOPE,
      prompt: '', // '' means prompt only when needed
      callback: (tokenResponse: any) => {
        if (tokenResponse.error) {
          console.error('Token client callback error:', tokenResponse.error);
          toast({
            title: 'Authentication Error',
            description: tokenResponse.error_description || 'Failed to obtain access token',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        // Save/access token and manage accounts
        const token = tokenResponse.access_token;
        if (!token) {
          toast({
            title: 'Authentication Error',
            description: 'No access token received',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        setAccessToken(token);
        setIsAuthenticated(true);
        setIsLoading(false);

        // Store token temporarily and get user email via token
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(res => res.json())
          .then(userInfo => {
            const email = userInfo.email;
            if (!email) {
              throw new Error('Failed to get user email');
            }
            setCurrentAccount(email);

            // Store in localStorage
            const storedAccounts = JSON.parse(localStorage.getItem('gmail_connected_accounts') || '[]');
            const updatedAccounts = [...new Set([...storedAccounts, email])];
            setConnectedAccounts(updatedAccounts);
            localStorage.setItem('gmail_connected_accounts', JSON.stringify(updatedAccounts));
            localStorage.setItem('gmail_current_account', email);
            localStorage.setItem(`gmail_access_token_${email}`, token);

            toast({
              title: 'Gmail Connected',
              description: `Successfully connected to ${email}`,
            });
          })
          .catch(error => {
            console.error('Failed to get user info', error);
            toast({
              title: 'User Info Error',
              description: 'Could not retrieve user profile info',
              variant: 'destructive',
            });
          });
      },
    });

    setTokenClient(newTokenClient);
  }, [gisInitialized, clientId, tokenClient, toast]);

  // On mount, load tokens/accounts from localStorage
  useEffect(() => {
    const storedAccounts = JSON.parse(localStorage.getItem('gmail_connected_accounts') || '[]');
    const storedCurrent = localStorage.getItem('gmail_current_account');
    if (storedAccounts.length > 0 && storedCurrent) {
      const token = localStorage.getItem(`gmail_access_token_${storedCurrent}`);
      if (token) {
        setAccessToken(token);
        setIsAuthenticated(true);
        setCurrentAccount(storedCurrent);
        setConnectedAccounts(storedAccounts);
      }
    }
  }, []);

  // Helper: Check token validity by calling tokeninfo or test API
  const checkTokenValidity = useCallback(async (token: string) => {
    if (!token) return false;
    try {
      const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`);
      if (!response.ok) return false;
      const data = await response.json();
      if (data.error_description) return false;
      return true;
    } catch {
      return false;
    }
  }, []);

  // Automatically refresh token when needed
  useEffect(() => {
    if (!accessToken || !tokenClient) return;

    let intervalId: NodeJS.Timeout;

    const refreshToken = async () => {
      const valid = await checkTokenValidity(accessToken);
      if (!valid) {
        setIsLoading(true);
        tokenClient.requestAccessToken({ prompt: 'none' }); // Silent token request
      }
    };

    // Check every 5 minutes
    intervalId = setInterval(refreshToken, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [accessToken, tokenClient, checkTokenValidity]);

  // User-initiated sign-in
  const signInWithGoogle = useCallback((clientId: string) => {
    if (!gisInitialized) {
      toast({
        title: 'Google API Loading',
        description: 'Please wait, Google API is still loading.',
        variant: 'destructive',
      });
      return;
    }
    if (!clientId) {
      toast({
        title: 'Client ID Missing',
        description: 'Google OAuth Client ID is required.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    const newTokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: GMAIL_SCOPE,
      prompt: 'consent',
      callback: (tokenResponse: any) => {
        setIsLoading(false);
        if (tokenResponse.error) {
          toast({
            title: 'Authentication Failed',
            description: tokenResponse.error_description || 'Could not obtain access token.',
            variant: 'destructive',
          });
          return;
        }
        const token = tokenResponse.access_token;
        if (!token) {
          toast({
            title: 'Authentication Failed',
            description: 'No access token received.',
            variant: 'destructive',
          });
          return;
        }
        setAccessToken(token);
        setIsAuthenticated(true);

        // Fetch user info
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(res => res.json())
          .then(userInfo => {
            const email = userInfo.email;
            if (!email) throw new Error('Email not found.');
            setCurrentAccount(email);
            // Update accounts
            const stored = JSON.parse(localStorage.getItem('gmail_connected_accounts') ?? '[]');
            const updated = [...new Set([...stored, email])];
            setConnectedAccounts(updated);
            localStorage.setItem('gmail_connected_accounts', JSON.stringify(updated));
            localStorage.setItem('gmail_current_account', email);
            localStorage.setItem(`gmail_access_token_${email}`, token);

            toast({
              title: 'Gmail Connected',
              description: `Connected to ${email}`,
            });
          })
          .catch(() => toast({
              title: 'User Info Error',
              description: 'Failed to retrieve user email info.',
              variant: 'destructive',
            }));
      },
    });

    setTokenClient(newTokenClient);
    newTokenClient.requestAccessToken({ prompt: 'consent' });
  }, [gisInitialized, toast]);

  // Sign out (single or all accounts)
  const signOut = useCallback(
  (email?: string) => {
    if (email) {
      // Remove one specific account token
      localStorage.removeItem(`gmail_access_token_${email}`);

      const updatedAccounts = connectedAccounts.filter(acc => acc !== email);
      setConnectedAccounts(updatedAccounts);
      localStorage.setItem('gmail_connected_accounts', JSON.stringify(updatedAccounts));

      if (currentAccount === email) {
        if (updatedAccounts.length > 0) {
          const nextEmail = updatedAccounts[0];
          const token = localStorage.getItem(`gmail_access_token_${nextEmail}`);
          setCurrentAccount(nextEmail);
          setAccessToken(token);
          setIsAuthenticated(!!token);
          localStorage.setItem('gmail_current_account', nextEmail);
        } else {
          setCurrentAccount(null);
          setAccessToken(null);
          setIsAuthenticated(false);
          localStorage.removeItem('gmail_current_account');
        }
      }

      toast({
        title: 'Account Disconnected',
        description: `Disconnected ${email}`,
      });
    } else {
      // Remove all accounts tokens
      connectedAccounts.forEach(acc => localStorage.removeItem(`gmail_access_token_${acc}`));
      localStorage.removeItem('gmail_connected_accounts');
      localStorage.removeItem('gmail_current_account');
      setConnectedAccounts([]);
      setCurrentAccount(null);
      setAccessToken(null);
      setIsAuthenticated(false);

      toast({
        title: 'All Accounts Disconnected',
        description: 'Disconnected all accounts',
      });
    }
  },
  [connectedAccounts, currentAccount, toast]
);

  // Switch connected account
  const switchAccount = useCallback(
    (email: string) => {
      const token = localStorage.getItem(`gmail_access_token_${email}`);
      if (token) {
        setCurrentAccount(email);
        setAccessToken(token);
        setIsAuthenticated(true);
        localStorage.setItem('gmail_current_account', email);
        toast({ title: 'Account Switched', description: `Switched to ${email}` });
      } else {
        toast({ title: 'Switch Account Failed', description: 'Token not found for this account', variant: 'destructive' });
      }
    },
    [toast],
  );

  return {
    isAuthenticated,
    accessToken,
    currentAccount,
    connectedAccounts,
    signInWithGoogle,
    signOut,
    switchAccount,
    isLoading,
  };
};
