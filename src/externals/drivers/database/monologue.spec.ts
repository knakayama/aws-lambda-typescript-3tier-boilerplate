import { MonologueDatabaseDriver } from '@externals/drivers/database/monologue'
import { MonologueTableUtils } from '@test/utils/monologue-table-utils'
import { Monologue } from '@externals/drivers/database/monologue-interfaces'

process.env.MONOLOGUE_TABLE = 'Monologue'

describe('BookDatabaseDriver', () => {
  const monologueTableUtils = new MonologueTableUtils(
    process.env.MONOLOGUE_TABLE!
  )
  const monologueDatabaseDriver = new MonologueDatabaseDriver(
    monologueTableUtils.dynamoDBD
  )

  describe('createMonologue', () => {
    const itemCount = 1
    beforeEach(async () => {
      await monologueTableUtils.createTable()
    })

    afterEach(async () => {
      await monologueTableUtils.deleteTable()
    })

    describe('When everything is ok', () => {
      let monologues: Monologue[] = []
      beforeEach(async () => {
        monologues = MonologueTableUtils.generateMonologues(itemCount)
      })

      test('should create a monologue', async () => {
        await monologueDatabaseDriver.createMonologue(monologues[0])
        const actual = await monologueTableUtils.findMonologues()

        expect(actual.length).toBe(itemCount)
        expect(actual[0].something).toBe(monologues[0].something)
      })
    })
  })
})
