import { SaySomethingController } from '@controllers/i-wanna/say-something'
import { ErrorCodes } from '@presenters/error-codes'
import {
  BadRequestResult,
  ErrorResult,
  InternalServerErrorResult,
} from '@presenters/errors'
import { ApiHandler } from '@presenters/interfaces'
import { HttpStatusCodes } from '@presenters/status-codes'
import { MonologueTableUtils } from '@test/utils/monologue-table-utils'
import {
  callFailureForRequestBody,
  callSuccessForRequestBody,
} from '@test/utils/caller'
import {
  ApiErrorResponseParsed,
  ApiResponseParsed,
} from '@test/utils/interfaces'
import { SaySomethingUseCase } from '@use-cases/i-wanna/say-something'
import { Monologue } from '@externals/drivers/database/monologue-interfaces'
import { MonologueDatabaseDriver } from '@externals/drivers/database/monologue'
import { Chance } from 'chance'

const chance = new Chance.Chance()

describe('SaySomethingController', () => {
  const saySomethingUseCase = new SaySomethingUseCase(
    new MonologueDatabaseDriver()
  )
  const saySomethingController = new SaySomethingController(saySomethingUseCase)

  async function callAndCheckError(
    handler: ApiHandler,
    expectedHttpStatusCode: number,
    errorResult: ErrorResult,
    requestBody: Monologue
  ): Promise<void> {
    const response: ApiErrorResponseParsed = await callFailureForRequestBody(
      handler,
      requestBody
    )
    expect(response.statusCode).toBe(expectedHttpStatusCode)
    expect(response.parsedBody.error.code).toBe(errorResult.code)
    expect(response.parsedBody.error.description).toBe(errorResult.description)
  }

  describe('saySomething', () => {
    describe('When there is no request body', () => {
      test('should return Bad Request', async () => {
        const unexpectedRequestBody = (undefined as unknown) as Monologue
        const errorResult = new BadRequestResult(
          ErrorCodes.BadRequest,
          'Please specify a request body!'
        )
        await callAndCheckError(
          saySomethingController.saySomething,
          HttpStatusCodes.BadRequest,
          errorResult,
          unexpectedRequestBody
        )
      })
    })

    describe('When something is missing', () => {
      let unexpectedRequestBody: Monologue[] = []
      beforeEach(() => {
        unexpectedRequestBody = MonologueTableUtils.generateMonologues()
        unexpectedRequestBody[0].something = ''
      })
      test('should return Bad Request', async () => {
        const errorResult = new BadRequestResult(
          ErrorCodes.BadRequest,
          'Please specify a valid request body!'
        )
        await callAndCheckError(
          saySomethingController.saySomething,
          HttpStatusCodes.BadRequest,
          errorResult,
          unexpectedRequestBody[0]
        )
      })
    })

    describe('Unexpected internal situations', () => {
      let testRequestBody: Monologue[] = []
      const message = chance.string()
      beforeEach(() => {
        testRequestBody = MonologueTableUtils.generateMonologues()
      })
      test('should return Internal Server Error', async () => {
        const errorResult = new InternalServerErrorResult(
          ErrorCodes.InternalServerError,
          message
        )
        jest
          .spyOn(saySomethingUseCase, 'saySomething')
          .mockRejectedValueOnce(
            new InternalServerErrorResult(
              ErrorCodes.InternalServerError,
              message
            )
          )

        await callAndCheckError(
          saySomethingController.saySomething,
          HttpStatusCodes.InternalServerError,
          errorResult,
          testRequestBody[0]
        )
      })
    })

    describe('When something is not valid', () => {
      let testRequestBody: Monologue[] = []
      beforeEach(() => {
        testRequestBody = MonologueTableUtils.generateMonologues()
        testRequestBody[0].something = 'something-invalid'
      })

      test('should return Bad Request', async () => {
        const errorResult = new BadRequestResult(
          ErrorCodes.BadRequest,
          'Please specify a valid book title!'
        )

        await callAndCheckError(
          saySomethingController.saySomething,
          HttpStatusCodes.BadRequest,
          errorResult,
          testRequestBody[0]
        )
      })
    })

    describe('When it suceeds', () => {
      let testRequestBody: Monologue[] = []
      beforeEach(() => {
        testRequestBody = MonologueTableUtils.generateMonologues()
      })
      test('should return 202', async () => {
        jest.spyOn(saySomethingUseCase, 'saySomething').mockResolvedValue()

        const actualResponse: ApiResponseParsed<unknown> = await callSuccessForRequestBody<
          unknown
        >(saySomethingController.saySomething, testRequestBody[0])
        expect(actualResponse.statusCode).toBe(HttpStatusCodes.NoContent)
        expect(actualResponse.parsedBody).toBeEmpty()
      })
    })
  })
})
