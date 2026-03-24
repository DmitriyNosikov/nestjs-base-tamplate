export const ENV_FILE_PATH = process.env.NODE_ENV
  ? `.env.${process.env.NODE_ENV}`
  : `.env.dev`;
export const GLOBAL_API_PREFIX = 'api';
export const SwaggerConfig = {
  DOCS_PREFIX: 'api/docs',
  JSON_DOCUMENT_URL: 'api/docs-json',
  YAML_DOCUMENT_URL: 'api/docs-yaml',
} as const;