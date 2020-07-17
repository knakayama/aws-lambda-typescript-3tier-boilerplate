import {
  ApiCallback,
  ApiContext,
  ApiEvent,
  ApiHandler,
} from '@presenters/interfaces'
import { Logger } from '@modules/utils/logger'

export class ApiInterceptor {
  constructor(
    private readonly _controllerMethod: (
      event: ApiEvent,
      context: ApiContext,
      callback: ApiCallback
    ) => void
  ) {}

  saySomething: ApiHandler = (
    event: ApiEvent,
    context: ApiContext,
    callback: ApiCallback
  ): void => {
    Logger.getLogger(event.headers['x-amzn-trace-id'])
    this._controllerMethod(event, context, callback)
  }
}
