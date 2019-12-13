import { getLogger } from '../logger'

const logger = getLogger('api:uploads')

export const upload = req => {
  logger.info('file uploaded to', req.file.path)
  return {
    filePath: req.file.path,
  }
}
