export const ENV_FILE_PATH = process.env.NODE_ENV
  ? `${process.env.NODE_ENV}.env`
  : `dev.env`;
export const GLOBAL_API_PREFIX = 'api';