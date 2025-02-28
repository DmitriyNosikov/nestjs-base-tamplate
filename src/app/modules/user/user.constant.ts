export const USER_ROUTES = {
  BASE: 'users',
  
  LOGIN: '/login',
  TOKEN_REFRESH: '/token-refresh',

  INDEX: '/',

  CREATE: '/',
  GET: '/:userId',
  PATCH: '/:userId',
  DELETE: '/:userId',
} as const;