import {
  ApiContext,
  ApiEvent,
  ApiHandler,
  ApiResponse,
  ErrorResponseBody,
} from '@presenters/interfaces'
import {
  ApiErrorResponseParsed,
  ApiResponseParsed,
  PathParameter,
  Headers,
} from '@test/utils/interfaces'
import { Monologue } from '@externals/drivers/database/monologue-interfaces'

function invokeHandlerForFailure(
  event: ApiEvent,
  handler: ApiHandler
): Promise<ApiErrorResponseParsed> {
  return new Promise((resolve, reject) => {
    handler(
      event,
      {} as ApiContext,
      (error?: Error | null | string, result?: ApiResponse): void => {
        if (typeof result === 'undefined') {
          reject('No result was returned by the handler!')
          return
        }
        const parsedResult: ApiErrorResponseParsed = result as ApiErrorResponseParsed
        parsedResult.parsedBody = JSON.parse(result.body) as ErrorResponseBody
        resolve(parsedResult)
      }
    )
  })
}

function invokeHandlerForSuccess<T>(
  event: ApiEvent,
  handler: ApiHandler
): Promise<ApiResponseParsed<T>> {
  return new Promise((resolve, reject) => {
    handler(
      event,
      {} as ApiContext,
      (error?: Error | null | string, result?: ApiResponse): void => {
        if (typeof result === 'undefined') {
          reject('No result was returned by the handler!')
          return
        }
        const parsedResult: ApiResponseParsed<T> = result as ApiResponseParsed<
          T
        >
        parsedResult.parsedBody = JSON.parse(result.body) as T

        resolve(parsedResult)
      }
    )
  })
}

export function callSuccessForParameter<T>(
  handler: ApiHandler,
  parameters: PathParameter,
  headers?: Headers
): Promise<ApiResponseParsed<T>> {
  const event: ApiEvent = {} as ApiEvent
  event.pathParameters = parameters

  if (headers) {
    event.headers = headers
  }
  return invokeHandlerForSuccess(event, handler)
}

export function callSuccessForRequestBody<T>(
  handler: ApiHandler,
  requestBody: Monologue
): Promise<ApiResponseParsed<T>> {
  const event: ApiEvent = {} as ApiEvent
  event.body = JSON.stringify(requestBody)

  return invokeHandlerForSuccess<T>(event, handler)
}

export function callSuccessForRequestBodyAndParameter<T>(
  handler: ApiHandler,
  requestBody: Monologue,
  parameters: PathParameter
): Promise<ApiResponseParsed<T>> {
  const event: ApiEvent = {} as ApiEvent
  event.body = JSON.stringify(requestBody)
  event.pathParameters = parameters

  return invokeHandlerForSuccess<T>(event, handler)
}

export function callSuccess<T>(
  handler: ApiHandler
): Promise<ApiResponseParsed<T>> {
  const event: ApiEvent = {} as ApiEvent

  return invokeHandlerForSuccess<T>(event, handler)
}

export function callFailureForParameter(
  handler: ApiHandler,
  parameters: PathParameter,
  headers?: Headers
): Promise<ApiErrorResponseParsed> {
  const event: ApiEvent = {} as ApiEvent
  event.pathParameters = parameters

  if (headers) {
    event.headers = headers
  }

  return invokeHandlerForFailure(event, handler)
}

export function callFailureForRequestBodyAndParameter(
  handler: ApiHandler,
  requestBody: Monologue,
  parameters: PathParameter
): Promise<ApiErrorResponseParsed> {
  const event: ApiEvent = {} as ApiEvent
  event.body = JSON.stringify(requestBody)
  event.pathParameters = parameters

  return invokeHandlerForFailure(event, handler)
}

export function callFailureForRequestBody(
  handler: ApiHandler,
  requestBody?: Monologue
): Promise<ApiErrorResponseParsed> {
  const event: ApiEvent = {} as ApiEvent
  event.body = JSON.stringify(requestBody)

  return invokeHandlerForFailure(event, handler)
}

export function callFailure(
  handler: ApiHandler
): Promise<ApiErrorResponseParsed> {
  const event: ApiEvent = {} as ApiEvent

  return invokeHandlerForFailure(event, handler)
}
