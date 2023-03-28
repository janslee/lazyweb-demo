import { Configuration, App } from '@midwayjs/decorator';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';
import * as oss from '@midwayjs/oss';
import * as staticCache from 'koa-static-cache';
import * as jwt from '@midwayjs/jwt';
import * as passport from '@midwayjs/passport';
// import { DefaultErrorFilter } from './filter/default.filter';
// import { NotFoundFilter } from './filter/notfound.filter';
import { ReportMiddleware } from './middleware/report.middleware';
import { JwtcustomMiddleware } from './middleware/jwtcustom.middleware';

import { PowerMiddleware } from './middleware/power.middleware';
import * as upload from '@midwayjs/upload';
@Configuration({
  imports: [
    koa,
    jwt,
    validate,
    upload,
    oss,
    passport,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;

  async onReady() {
    // add middleware
    this.app.useMiddleware(require('@koa/cors')())
    this.app.useMiddleware([JwtcustomMiddleware,ReportMiddleware,PowerMiddleware]);

    this.app.use(
      staticCache({
        prefix: '/',
        dir: join(__dirname, './public'),
      })
    );
    // add filter
    // this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}
