import { Stack, App, StackProps } from '@aws-cdk/core'
import { Table } from '@infrastructures/components/constructs/table'

export class Database extends Stack {
  readonly monologueTable: Table

  constructor(
    readonly parent: App,
    readonly name: string,
    readonly props: StackProps
  ) {
    super(parent, name, props)

    this.monologueTable = new Table(this, 'MonologueTable')
  }
}
