import { Stack, App, StackProps } from '@aws-cdk/core'
import { DNSValidatorConstruct } from '@infrastructures/components/constructs/dns-validator'

interface SSLTLSCertsStackProps extends StackProps {
  domain: string
  hostedZoneId: string
}

export class SSLTLSCertsStack extends Stack {
  readonly staticSiteCert: DNSValidatorConstruct
  readonly apiCert: DNSValidatorConstruct

  constructor(
    readonly scope: App,
    readonly name: string,
    readonly props: SSLTLSCertsStackProps
  ) {
    super(scope, name, props)

    this.staticSiteCert = new DNSValidatorConstruct(this, 'StaticSiteCert', {
      domainName: `app.${props.domain}`,
      hostedZoneId: props.hostedZoneId,
      region: 'us-east-1',
    })

    this.apiCert = new DNSValidatorConstruct(this, 'ApiCert', {
      domainName: `api.${props.domain}`,
      hostedZoneId: props.hostedZoneId,
    })
  }
}
