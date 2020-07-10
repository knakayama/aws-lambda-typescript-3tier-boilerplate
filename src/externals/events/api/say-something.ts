import { SaySomethingController } from '@controllers/i-wanna/say-something'
import { SaySomethingUseCase } from '@use-cases/i-wanna/say-something'
import { MonologueDatabaseDriver } from '@externals/drivers/database/monologue'
import { ApiInterceptor } from '@middlewares/api/interceptor'

const monologueDatabaseDriver = new MonologueDatabaseDriver()
const saySomethingUseCase = new SaySomethingUseCase(monologueDatabaseDriver)
const saySomethingController = new SaySomethingController(saySomethingUseCase)
const apiInterceptor = new ApiInterceptor(saySomethingController)

export const saySomething = apiInterceptor.saySomething
