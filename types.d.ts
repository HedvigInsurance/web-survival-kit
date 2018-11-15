declare module '@hedviginsurance/web-survival-kit' {
  import * as Koa from 'koa'
  import * as Router from 'koa-router'
  import { IHelmetConfiguration } from 'helmet'

  export interface KoaServerOptions {
    publicPath: string
    assetLocation: string
    helmetConfig?: IHelmetConfiguration
    authConfig?: {
      name: string
      pass: string
    }
  }

  export interface ScriptLocationProps {
    statsLocation: string
    webpackPublicPath: string
  }

  export interface CreatedKoaServer {
    app: Koa
    router: Router
    getScriptLocation: (options: { statsLocation: string }) => string
  }

  export const createKoaServer: (options: KoaServerOptions) => CreatedKoaServer
  export const getScriptLocation: (options: ScriptLocationProps) => string
}
