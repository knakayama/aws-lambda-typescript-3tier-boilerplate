import { ErrorCodes } from '@presenters/error-codes'
import { InternalServerErrorResult } from '@presenters/errors'
import { Monologue } from '@externals/drivers/database/monologue-interfaces'
import { MonologueDatabaseDriver } from '@externals/drivers/database/monologue'
import { Logger } from '@modules/utils/logger'

export class SaySomethingUseCase {
  constructor(private readonly _monologueDatabaseDriver: MonologueDatabaseDriver) {}

  async saySomething(monologue: Monologue): Promise<void> {
    const logger = Logger.getLogger()
    logger.info('use-cases')
    try {
      await this._monologueDatabaseDriver.createMonologue(monologue)
    } catch (error) {
      throw new InternalServerErrorResult(
        ErrorCodes.InternalServerError,
        error.message
      )
    }
  }
}
