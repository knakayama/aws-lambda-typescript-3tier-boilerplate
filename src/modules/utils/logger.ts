import * as bunyan from 'bunyan'

export class Logger {
  private static logger: Logger
  _logger: bunyan

  private constructor(traceId?: string) {
    this._logger = bunyan.createLogger({
      name: traceId || 'unknown-trace-id',
    })
  }

  static getLogger(traceId?: string): Logger {
    if (!Logger.logger) {
      Logger.logger = new Logger(traceId)
    }
    return Logger.logger
  }

  info(message: string): void {
    Logger.logger._logger.info(message)
  }

  error(message: string): void {
    Logger.logger._logger.error(message)
  }
}
