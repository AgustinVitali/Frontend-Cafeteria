export const auth0Config = {
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || 'dev-vxui3mkjgul4co4v.us.auth0.com',
  clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || 'uit0TyZuz4fGWqpqj3tEtjfyObLiMLnL',
  redirectUri: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
  audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || 'https://cafeteria-api',
  scope: 'openid profile email read:menu write:menu read:orders write:orders'
};

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'; 