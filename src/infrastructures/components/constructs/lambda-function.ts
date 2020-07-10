import { Construct, RemovalPolicy } from '@aws-cdk/core'
import * as lambdanodejs from '@aws-cdk/aws-lambda-nodejs'
import * as logs from '@aws-cdk/aws-logs'
import * as apigatewayv2 from '@aws-cdk/aws-apigatewayv2'

export class LambdaFunction extends Construct {
  readonly lambdaFunction: lambdanodejs.NodejsFunction

  constructor(
    readonly scope: Construct,
    readonly id: string,
    readonly props: lambdanodejs.NodejsFunctionProps & logs.LogGroupProps
  ) {
    super(scope, id)

    this.lambdaFunction = new lambdanodejs.NodejsFunction(
      this,
      'LambdaNodejs',
      props
    )

    new logs.LogGroup(this, 'LogGroup', {
      logGroupName: `/aws/lambda/${this.lambdaFunction.functionName}`,
      retention: props.retention || 14,
      removalPolicy: RemovalPolicy.DESTROY,
    })
  }

  toLambdaProxyIntegration(
    lambdaFunction: LambdaFunction
  ): apigatewayv2.LambdaProxyIntegration {
    return new apigatewayv2.LambdaProxyIntegration({
      handler: lambdaFunction.lambdaFunction,
    })
  }
}
