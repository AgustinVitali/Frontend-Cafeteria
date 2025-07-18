export const auth0Config = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN || 'your-domain.auth0.com',
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID || 'your-client-id',
  redirectUri: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
  audience: process.env.REACT_APP_AUTH0_AUDIENCE || 'http://localhost:8080',
  scope: 'openid profile email read:menu write:menu read:orders write:orders'
};

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080'; 