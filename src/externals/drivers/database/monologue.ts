import { Monologue } from '@externals/drivers/database/monologue-interfaces'
import { DynamoDB } from 'aws-sdk'

export class MonologueDatabaseDriver {
  constructor(
    private readonly _dynamoDBD = new DynamoDB.DocumentClient({
      apiVersion: '2012-08-10',
    })
  ) {}

  async createMonologue(monologue: Monologue): Promise<void> {
    const now = new Date().toISOString()
    const param: DynamoDB.DocumentClient.PutItemInput = {
      ConditionExpression:
        'attribute_not_exists(#MAIN_PK) AND attribute_not_exists(#MAIN_SK)',
      ExpressionAttributeNames: {
        '#MAIN_PK': 'main_pk',
        '#MAIN_SK': 'main_sk',
      },
      Item: {
        main_pk: `monologue|${monologue.something}`,
        main_sk: `monologue|${monologue.something}`,
        something: monologue.something,
        created_at: now,
        updated_at: now,
      },
      TableName: process.env.MONOLOGUE_TABLE!,
    }
    await this._dynamoDBD.put(param).promise()
  }
}
