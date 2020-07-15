import { App, StackProps } from '@aws-cdk/core'
import { Database } from '@infrastructures/components/stacks/database'
import { SSLTLSCertsStack } from '@infrastructures/components/stacks/ssl-tls-certs'
import { ContextUtils } from '@infrastructures/modules/context-utils'
import { ApiStack } from '@infrastructures/components/stacks/api'

class DemoApp extends App {
  constructor() {
    super()

    const stackProps: StackProps = {
      env: {
        account: process.env.ACCOUNT_ID,
        region: ContextUtils.getContext(this, 'region'),
      },
    }
    const database = new Database(this, 'Database', stackProps)
    const sslTLSCerts = new SSLTLSCertsStack(this, 'SSLTLSCerts', {
      ...stackProps,
      ...{
        hostedZoneId: process.env.HOSTED_ZONE_ID!,
        domain: process.env.DOMAIN!,
      },
    })
    new ApiStack(this, 'Api', {
      ...stackProps,
      ...{
        table: database.monologueTable.table,
        cert: sslTLSCerts.apiCert.dnsValidatedCert,
        allowedOrigin: ContextUtils.getContext(this, 'allowedOrigin'),
        domain: `api.${process.env.DOMAIN!}`,
        hostedZoneId: process.env.HOSTED_ZONE_ID!,
      },
    })
  }
}

new DemoApp()
