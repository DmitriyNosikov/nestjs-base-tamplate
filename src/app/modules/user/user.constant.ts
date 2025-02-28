export const USER_ROUTES = {
  BASE: 'users',
  
  LOGIN: '/login',

  INDEX: '/',

  CREATE: '/',
  GET: '/:userId',
  PATCH: '/:userId',
  DELETE: '/:userId',
} as const;