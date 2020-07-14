import { DynamoDBUtils } from '@test/utils/dynamodb-table-utils'
import { Monologue } from '@externals/drivers/database/monologue-interfaces'
import { DynamoDB } from 'aws-sdk'
import { Chance } from 'chance'

const chance: Chance.Chance = new Chance()

export class MonologueTableUtils {
  static toMonologue(v: Monologue): Monologue {
    return {
      something: v.something,
    }
  }

  static generateMonologue(): Monologue {
    const something = chance.string({ pool: 'abcde1234' })
    return { something }
  }

  static generateMonologues(itemCount = 1): Monologue[] {
    const monologues: Monologue[] = []
    for (let i: number = itemCount; i > 0; i -= 1) {
      monologues.push(this.generateMonologue())
    }
    return monologues
  }

  static toWriteRequests<T>(
    items: T[]
  ): DynamoDB.DocumentClient.WriteRequest[] {
    const writeRequests: DynamoDB.DocumentClient.WriteRequest[] = []

    for (const item of items.values()) {
      writeRequests.push({
        PutRequest: {
          Item: item,
        },
      })
    }

    return writeRequests
  }

  dynamoDBD: DynamoDB.DocumentClient

  tableName: string

  constructor(tableName: string) {
    this.tableName = tableName
    this.dynamoDBD = DynamoDBUtils.dynamoDBD
  }

  async batchWriteItems<T>(items: T[]): Promise<void> {
    const writeRequests: DynamoDB.DocumentClient.WriteRequest[] = MonologueTableUtils.toWriteRequests(
      items
    )
    const param: DynamoDB.DocumentClient.BatchWriteItemInput = {
      RequestItems: {
        [this.tableName]: writeRequests,
      },
    }
    await this.dynamoDBD.batchWrite(param).promise()
  }

  async createTable(): Promise<void> {
    await DynamoDBUtils.createTable(this.tableName)
  }

  async deleteTable(): Promise<void> {
    await DynamoDBUtils.deleteTable(this.tableName)
  }

  async findMonologues(): Promise<Monologue[]> {
    const param: DynamoDB.DocumentClient.ScanInput = {
      TableName: this.tableName,
    }
    return this.dynamoDBD
      .scan(param)
      .promise()
      .then(
        (data: DynamoDB.DocumentClient.ScanOutput) => data.Items as Monologue[]
      )
  }
}
