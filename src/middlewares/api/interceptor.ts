import {
  ApiCallback,
  ApiContext,
  ApiEvent,
  ApiHandler,
} from '@presenters/interfaces'
import { SaySomethingController } from '@controllers/i-wanna/say-something'
import { Logger } from '@modules/utils/logger'

export class ApiInterceptor {
  constructor(
    private readonly _saySomethingController: SaySomethingController
  ) {}

  saySomething: ApiHandler = (
    event: ApiEvent,
    context: ApiContext,
    callback: ApiCallback
  ): void => {
    Logger.getLogger(event.headers['x-amzn-trace-id'])
    this._saySomethingController.saySomething(event, context, callback)
  }
}
