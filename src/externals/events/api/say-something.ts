import { SaySomethingController } from '@controllers/i-wanna/say-something'
import { SaySomethingUseCase } from '@use-cases/i-wanna/say-something'
import { MonologueDatabaseDriver } from '@externals/drivers/database/monologue'

const monologueDatabaseDriver = new MonologueDatabaseDriver()
const saySomethingUseCase = new SaySomethingUseCase(monologueDatabaseDriver)
const saySomethingController = new SaySomethingController(saySomethingUseCase)

export const saySomething = saySomethingController.saySomething
