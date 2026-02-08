export function getEnvPath(): string {
  const env = process.env.NODE_ENV
  switch (env) {
    case 'dev':
      return '.env.dev'
    case 'test':
      return '.env.test'
    case 'staging':
      return '.env.staging'
    case 'prod':
      return '.env.prod'
    default:
      return 'rmb-api-service.env'
  }
}