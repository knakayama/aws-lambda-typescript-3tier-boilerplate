import { ErrorCodes } from '@presenters/error-codes'
import { InternalServerErrorResult } from '@presenters/errors'
import { Monologue } from '@externals/drivers/database/monologue-interfaces'
import { MonologueDatabaseDriver } from '@externals/drivers/database/monologue'

export class SaySomethingUseCase {
  constructor(private readonly _bookDatabaseDriver: MonologueDatabaseDriver) {}

  async saySomething(monologue: Monologue): Promise<void> {
    try {
      await this._bookDatabaseDriver.createMonologue(monologue)
    } catch (error) {
      throw new InternalServerErrorResult(
        ErrorCodes.InternalServerError,
        error.message
      )
    }
  }
}
