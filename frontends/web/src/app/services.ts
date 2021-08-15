export interface Service {
  internalHost: string
  externalUrl: string
}

const serviceSuffixToConfigKey = (suffix: string): string =>
  suffix.toUpperCase().replace('-', '_')

const createService = (suffix: string): Service => {
  let internalHost = `${process.env.API_ROOT}/${suffix}`

  const key = `API_ROOT_${serviceSuffixToConfigKey(suffix)}`
  const internalHostFromConfig = process.env[key]

  if (internalHostFromConfig !== undefined) {
    internalHost = internalHostFromConfig
  }

  return {
    internalHost,
    externalUrl: `/api/${suffix}`,
  }
}

const services: { [key: string]: Service } = {
  tadokuContest: createService('tadoku-contest-api'),
  identity: createService('identity-api'),
  blog: createService('blog-api'),
}

export const getAllServices = () => {
  return Object.values(services)
}

export const getService = (service: string): Service => {
  if (service in services) {
    return services[service]
  }

  throw new Error(`service not found with name ${service}`)
}
