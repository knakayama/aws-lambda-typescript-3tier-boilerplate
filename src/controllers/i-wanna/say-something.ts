import { SomethingToSayValidator } from '@controllers/i-wanna/something-to-say-validator'
import { ErrorCodes } from '@presenters/error-codes'
import { ErrorResult } from '@presenters/errors'
import {
  ApiCallback,
  ApiContext,
  ApiEvent,
  ApiHandler,
} from '@presenters/interfaces'
import { ResponseBuilder } from '@presenters/response-builder'
import { SaySomethingUseCase } from '@use-cases/i-wanna/say-something'
import { Monologue } from '@externals/drivers/database/monologue-interfaces'
import { Logger } from '@modules/utils/logger'

export class SaySomethingController {
  constructor(private readonly _saySomethingUseCase: SaySomethingUseCase) {}

  saySomething: ApiHandler = (
    event: ApiEvent,
    context: ApiContext,
    callback: ApiCallback
  ): void => {
    const logger = Logger.getLogger()
    if (!event.body) {
      return ResponseBuilder.badRequest(
        ErrorCodes.BadRequest,
        'Please specify a request body!',
        callback
      )
    }

    const requestBody: Monologue = JSON.parse(event.body) as Monologue

    logger.info(JSON.stringify(requestBody))
    if (!requestBody.something) {
      ResponseBuilder.badRequest(
        ErrorCodes.BadRequest,
        'Please specify a valid request body!',
        callback
      )
    }

    if (SomethingToSayValidator.isSomethingInvalid(requestBody.something)) {
      ResponseBuilder.badRequest(
        ErrorCodes.BadRequest,
        'Please specify a valid book title!',
        callback
      )
    }

    this._saySomethingUseCase
      .saySomething(requestBody)
      .then(() => {
        ResponseBuilder.noContent(callback)
      })
      .catch((error: ErrorResult) => {
        ResponseBuilder.internalServerError(
          error.code,
          error.description,
          callback
        )
      })
  }
}
