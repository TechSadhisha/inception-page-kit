
declare global {
  interface Window {
    gapi: {
      load: (api: string, callback: () => void) => void;
      auth2: {
        init: (config: {
          client_id: string;
          scope: string;
        }) => Promise<GoogleAuth>;
        getAuthInstance: () => GoogleAuth | null;
      };
    };
  }
}

interface GoogleAuth {
  signIn: () => Promise<GoogleUser>;
  signOut: () => Promise<void>;
  isSignedIn: {
    get: () => boolean;
  };
}

interface GoogleUser {
  getAuthResponse: () => {
    access_token: string;
    expires_in: number;
    id_token: string;
  };
  getBasicProfile: () => {
    getId: () => string;
    getName: () => string;
    getEmail: () => string;
  };
}

export {};
