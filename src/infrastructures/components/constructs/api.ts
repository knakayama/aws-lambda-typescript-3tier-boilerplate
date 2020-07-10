import { Construct, Duration } from '@aws-cdk/core'
import { LambdaFunction } from '@infrastructures/components/constructs/lambda-function'
import * as path from 'path'
import * as lambda from '@aws-cdk/aws-lambda'
import * as dynamodb from '@aws-cdk/aws-dynamodb'
import * as acm from '@aws-cdk/aws-certificatemanager'
import * as apigatewayv2 from '@aws-cdk/aws-apigatewayv2'
import * as apigateway from '@aws-cdk/aws-apigateway'
//import * as route53 from '@aws-cdk/aws-route53'
//import * as alias from '@aws-cdk/aws-route53-targets'

interface DemoApi {
  stageName: string
  table: dynamodb.Table
  allowedOrigin: string
  cert: acm.Certificate
  domain: string
  hostedZoneId: string
}

export class ApiConstruct extends Construct {
  constructor(
    readonly scope: Construct,
    readonly id: string,
    readonly props: DemoApi
  ) {
    super(scope, id)

    const pathToDist = '../../../../dist'

    const createMonologue = new LambdaFunction(this, 'saySomething', {
      code: lambda.Code.asset(
        path.join(__dirname, `${pathToDist}/say-something`)
      ),
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.saySomething',
      environment: {
        MONOLOGUE_TABLE: props.table.tableName,
        ALLOWED_ORIGIN: props.allowedOrigin,
      },
      tracing: lambda.Tracing.ACTIVE,
    })
    props.table.grantWriteData(createMonologue.lambdaFunction)

    const api = new apigatewayv2.HttpApi(this, 'HttpApi', {
      corsPreflight: {
        allowCredentials: props.allowedOrigin === '*' ? false : true,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
        allowMethods: [
          apigatewayv2.HttpMethod.GET,
          apigatewayv2.HttpMethod.HEAD,
          apigatewayv2.HttpMethod.OPTIONS,
          apigatewayv2.HttpMethod.POST,
          apigatewayv2.HttpMethod.PATCH,
          apigatewayv2.HttpMethod.PUT,
        ],
        allowOrigins: [props.allowedOrigin],
        maxAge: Duration.days(10),
      },
    })

    api.addRoutes({
      path: '/monologues',
      methods: [apigatewayv2.HttpMethod.POST],
      integration: new apigatewayv2.LambdaProxyIntegration({
        handler: createMonologue.lambdaFunction,
      }),
    })

    const apiDomainName = new apigatewayv2.DomainName(
      this,
      'HttpApiDomainName',
      {
        domainName: props.domain,
        certificate: acm.Certificate.fromCertificateArn(
          this,
          'HttpApiCert',
          props.cert.certificateArn
        ),
      }
    )

    api.addStage('HttpApiStage', {
      autoDeploy: true,
      stageName: props.stageName,
      domainMapping: {
        domainName: apiDomainName,
        mappingKey: props.stageName,
      },
    })

    // TODO: not supported yet
    //const hostedZone = route53.HostedZone.fromHostedZoneAttributes(
    //  this,
    //  'HostedZone',
    //  {
    //    hostedZoneId: props.hostedZoneId,
    //    zoneName: props.domain,
    //  }
    //)

    //new route53.ARecord(this, 'AliasRecord', {
    //  recordName: 'api',
    //  zone: hostedZone,
    //  target: route53.AddressRecordTarget.fromAlias(
    //    new alias.ApiGatewayDomain(apiDomainName)
    //  )
    //})
  }
}
