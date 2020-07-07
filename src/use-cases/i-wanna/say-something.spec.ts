import { ErrorCodes } from '@presenters/error-codes'
import { InternalServerErrorResult } from '@presenters/errors'
import { MonologueTableUtils } from '@test/utils/monologue-table-utils'
import { SaySomethingUseCase } from '@use-cases/i-wanna/say-something'
import { MonologueDatabaseDriver } from '@externals/drivers/database/monologue'
import { Chance } from 'chance'

const chance = new Chance.Chance()

describe('SaySomethingUseCase', () => {
  const monologueDatabaseDriver = new MonologueDatabaseDriver()
  const saySomethingUseCase = new SaySomethingUseCase(monologueDatabaseDriver)

  describe('saySomething', () => {
    describe('When an exception happens', () => {
      const monologues = MonologueTableUtils.generateMonologues()
      const message = chance.string()

      test('should return Promise rejection', async () => {
        jest
          .spyOn(monologueDatabaseDriver, 'createMonologue')
          .mockImplementationOnce(() => {
            throw new Error(message)
          })

        await saySomethingUseCase
          .saySomething(monologues[0])
          .catch((error: InternalServerErrorResult) => {
            expect(error).toBeInstanceOf(InternalServerErrorResult)
            expect(error.code).toEqual(ErrorCodes.InternalServerError)
            expect(error.description).toEqual(message)
          })
      })
    })

    describe('When everthing is ok', () => {
      const monologues = MonologueTableUtils.generateMonologues()

      test('should return a book', async () => {
        jest
          .spyOn(monologueDatabaseDriver, 'createMonologue')
          .mockResolvedValueOnce()

        const actual = await saySomethingUseCase.saySomething(monologues[0])
        expect(actual).toBeUndefined()
      })
    })
  })
})
